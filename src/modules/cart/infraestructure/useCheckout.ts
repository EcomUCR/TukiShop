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

  /**
   * Procesar el checkout
   * @param paymentIntent objeto de Stripe (contiene zip_code, payment_id, etc.)
   * @param totals totales de la compra
   * @param addressData datos de la dirección escrita o seleccionada
   */
  // useCheckout.ts
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
      await refreshCart();

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

      // 🧾 Crear orden SIN zip_code
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

      // 💳 Confirmar pago (sin postal_code)
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

      if (paymentIntent?.status === "succeeded") {
        await clearCart();
        await clearTotals();
      }

      showAlert({
        title: "Pago exitoso 💳",
        message: "Tu orden fue registrada correctamente 🧾",
        type: "success",
      });

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
