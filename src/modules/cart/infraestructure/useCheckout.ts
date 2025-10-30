import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useAlert } from "../../../hooks/context/AlertContext";
import { useCart } from "../../../hooks/context/CartContext";
import { useCartTotals } from "../../../components/forms/useCartTotals";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export function useCheckout() {
  const { token, user } = useAuth();
  const { showAlert } = useAlert();
  const { cart, clearCart, refreshCart } = useCart();
  const { clearCart: clearTotals } = useCartTotals();

  const processCheckout = async (
    paymentIntent: any,
    totals: any,
    addressData?: {
      street?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
      phone_number?: string;
    }
  ) => {
    if (!token || !user) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión antes de realizar el pago 🧾",
        type: "warning",
      });
      return;
    }

    try {
      // 👇 Evita recarga de carrito aquí
      if (!cart || cart.items.length === 0) {
        showAlert({
          title: "Carrito vacío",
          message: "No hay productos para procesar el pago 🛒",
          type: "warning",
        });
        return;
      }

      if (!addressData?.street?.trim()) {
        showAlert({
          title: "Dirección requerida 🏠",
          message: "Por favor escribe o selecciona una dirección antes de pagar.",
          type: "warning",
        });
        return;
      }

      // 🧾 Crear orden
      const initRes = await axios.post(
        "/checkout/init",
        {
          subtotal: totals?.subtotal || 0,
          shipping: totals?.shipping || 0,
          taxes: totals?.taxes || 0,
          total: totals?.total || 0,
          street: addressData?.street,
          city: addressData?.city,
          state: addressData?.state,
          country: addressData?.country || "Costa Rica",
          zip_code: addressData?.zip_code || null,
          phone_number: addressData?.phone_number || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = initRes.data?.order?.id;
      console.log("🧾 Orden inicial creada:", orderId);

      // 🧩 Agregar productos
      const items = cart.items.map((item) => ({
        product_id: item.product.id,
        store_id: item.product.store?.id || null,
        quantity: Number(item.quantity),
        unit_price: item.product.discount_price
          ? Number(item.product.discount_price)
          : Number(item.product.price),
        discount_pct:
          item.product.discount_price && Number(item.product.price) > 0
            ? Math.round(
              ((Number(item.product.price) -
                Number(item.product.discount_price)) /
                Number(item.product.price)) *
              100
            )
            : 0,
      }));

      await axios.post(
        "/checkout/items",
        { order_id: orderId, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 💳 Confirmar pago
      const confirmRes = await axios.post(
        "/checkout/confirm",
        {
          order_id: orderId,
          status: paymentIntent?.status === "succeeded" ? "PAID" : "FAILED",
          payment_id: paymentIntent?.id || "N/A",
          payment_method:
            paymentIntent?.payment_method_types?.[0]?.toUpperCase() || "CARD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Orden confirmada:", confirmRes.data);

      // 🧹 Si el pago fue exitoso → limpiar todo sin recargar
      // 🧹 Si el pago fue exitoso → limpiar todo sin recargar la página
      if (paymentIntent?.status === "succeeded") {
        try {
          // 1️⃣ Limpia el carrito en backend
          await axios.post(
            `${import.meta.env.VITE_API_URL}/cart/clear`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("🧹 Carrito del servidor limpiado correctamente");

          // 2️⃣ Limpia el carrito y totales locales
          await clearCart();
          await clearTotals();

          // 3️⃣ Espera un poco y actualiza el carrito en contexto
          setTimeout(() => {
            refreshCart();
          }, 1000);
        } catch (err: any) {
          console.warn("⚠️ No se pudo limpiar el carrito:", err);
        }
      }


      // ✅ Mostrar alerta final
      showAlert({
        title: "Pago exitoso 💳",
        message: "Tu orden fue registrada correctamente 🧾",
        type: "success",
      });

      // ⏳ Espera 1.5 s y actualiza el estado del carrito sin reload
      setTimeout(() => {
        refreshCart(); // solo actualiza contexto
      }, 1500);

      return confirmRes.data;
    } catch (err: any) {
      console.error("❌ Error en checkout:", err.response?.data || err);
      showAlert({
        title: "Error del servidor",
        message:
          err.response?.data?.message ||
          "No se pudo registrar la orden. Revisa los datos del pago.",
        type: "error",
      });
      throw err;
    }
  };

  return { processCheckout };
}
