import { useState, useEffect } from "react";
import axios from "axios";
import { useCartTotals } from "./useCartTotals";
import { useVisa } from "../../modules/cart/infraestructure/useVisa";
import { useCheckout } from "../../modules/cart/infraestructure/useCheckout";
import visa from "../../img/resources/logo_visa.png";
import mastercard from "../../img/resources/logo_mastercard.png";
import paypal from "../../img/resources/logo_paypal.png";
import american_express from "../../img/resources/american_express_logo.png";
import { IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useAlert } from "../../hooks/context/AlertContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../ui/StripePaymentForm";
import { useAuth } from "../../hooks/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  "pk_test_51SJQBqLl2yLxOyLIFdLhdGoXjNKpBn2WFxWjMhInw72TUbRe7DVmYLa17tBOfswYlYqe0E3J3bqYWFyuJaEFYMLI00aJOZAoJY"
);

interface TotalsType {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
  currency: string;
  items_count?: number;
}

interface ShoppingFormProps {
  variant?: "checkout" | "product";
  onAddToCart?: () => void;
  productId?: number;
  quantity?: number;
}

export default function ShoppingForm({
  variant = "checkout",
  onAddToCart,
  productId,
  quantity = 1,
}: ShoppingFormProps) {
  const { getForexRate, rate, error: errorVisa } = useVisa();
  const { processCheckout } = useCheckout();
  const { totals, getTotals, getProductTotal, loading, error } = useCartTotals();
  const { showAlert } = useAlert();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressText, setAddressText] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [localTotals, setLocalTotals] = useState<TotalsType>(totals);

  const format = (n: number) => (n ?? 0).toLocaleString("es-CR");

  // ============================
  // 🔹 Cargar totales según modo
  // ============================
  useEffect(() => {
    let isMounted = true;

    const loadTotals = async () => {
      try {
        const id = productId ?? Number(params.id);
        if (variant === "product") {
          if (token) {
            // Usuario logueado → combinar carrito + producto
            const [cartRes, productRes] = await Promise.all([
              getTotals(),
              getProductTotal(id, quantity),
            ]);

            if (!isMounted) return;

            const cart: TotalsType = cartRes || {
              subtotal: 0,
              taxes: 0,
              shipping: 0,
              total: 0,
              currency: "CRC",
            };
            const product: TotalsType = productRes || {
              subtotal: 0,
              taxes: 0,
              shipping: 0,
              total: 0,
              currency: "CRC",
            };

            const combined: TotalsType = {
              subtotal: (cart.subtotal ?? 0) + (product.subtotal ?? 0),
              taxes: (cart.taxes ?? 0) + (product.taxes ?? 0),
              shipping: cart.shipping ?? 0,
              total:
                ((cart.total ?? 0) - (cart.shipping ?? 0)) +
                (product.total ?? 0),
              currency: "CRC",
            };

            setLocalTotals(combined);
          } else {
            // Usuario NO autenticado → solo el producto
            const productRes = await getProductTotal(id, quantity);
            if (isMounted && productRes) setLocalTotals(productRes);
          }
        } else if (variant === "checkout" && token) {
          const cartRes = await getTotals();
          if (isMounted && cartRes) setLocalTotals(cartRes);
        }
      } catch (err) {
        console.error("❌ Error al cargar totales:", err);
      }
    };

    loadTotals();

    return () => {
      isMounted = false;
    };
  }, [variant, productId, quantity, token]);

  // 🔹 Mantener sincronía en checkout
  useEffect(() => {
    if (variant === "checkout") setLocalTotals(totals);
  }, [totals, variant]);

  // ============================
  // 🔹 Cargar direcciones (solo checkout)
  // ============================
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("❌ Error al obtener direcciones:", err);
      }
    };
    if (token && variant === "checkout") fetchAddresses();
  }, [token, variant]);

  // ============================
  // 🧾 Manejo del pago (Stripe)
  // ============================
  const handlePayment = async (paymentIntent: any) => {
    const parts = addressText.split(",").map((p) => p.trim());
    const [street, city, state, country, zip_code, phone_number] = parts;

    const selected = addresses.find((a) => a.id === selectedAddressId);
    const finalAddress = selected
      ? selected
      : { street, city, state, country, zip_code, phone_number };

    if (!finalAddress.street || !finalAddress.city) {
      showAlert({
        title: "Dirección requerida 🏠",
        message:
          "Debes seleccionar una dirección guardada o escribir una nueva antes de continuar.",
        type: "warning",
      });
      return;
    }

    await getForexRate("CRC", "USD");
    await processCheckout(paymentIntent, totals, finalAddress);
  };

  // ============================
  // 🖼️ Render principal
  // ============================
  return (
    <div className="font-quicksand">
      <h2 className="text-xl font-bold mb-4 text-main">
        {variant === "product" ? "Detalles del producto" : "Detalles de la compra"}
      </h2>

      {variant === "checkout" && (!user || !token) ? (
        <div className="mt-6 p-5 border border-red-300 bg-red-50 rounded-lg text-center text-red-700">
          <p className="font-semibold mb-3">
            ⚠️ Debes iniciar sesión para ver los detalles de tu compra.
          </p>
          <Button
            onClick={() => navigate("/loginRegister")}
            className="bg-contrast-secondary hover:bg-main text-white rounded-full px-6"
          >
            Iniciar sesión
          </Button>
        </div>
      ) : loading ? (
        <p className="text-gray-500 mt-5">Cargando totales...</p>
      ) : error ? (
        <p className="text-red-500 mt-5">{error}</p>
      ) : (
        <div className="flex flex-col gap-6 pt-6">
          <div className="border-t pt-5 flex justify-between">
            <p>Subtotal:</p>
            <p className="text-[#7E22CE] font-semibold">
              ₡{format(localTotals?.subtotal)}
            </p>
          </div>

          <div className="border-t pt-5 flex justify-between">
            <p>Impuestos (13%):</p>
            <p className="text-[#7E22CE] font-semibold">
              ₡{format(localTotals?.taxes)}
            </p>
          </div>

          {/* ✅ Mostrar envío solo si hay costo */}
          {(localTotals?.shipping ?? 0) > 0 && (
            <div className="border-t pt-5 flex justify-between">
              <p>Envío:</p>
              <p className="text-[#7E22CE] font-semibold">
                ₡{format(localTotals.shipping)}
              </p>
            </div>
          )}

          <div className="border-t pt-5 flex justify-between">
            <p className="font-bold">Total:</p>
            <p className="font-bold text-[#5B21B6]">
              ₡{format(localTotals?.total)}
            </p>
          </div>
        </div>
      )}

      {/* Checkout */}
      {variant === "checkout" && user && token && (
        <>
          <div className="pt-10 flex flex-col gap-3 text-[#4C1D95]">
            <label className="flex items-center gap-2 text-base font-semibold">
              <IconMapPin className="text-[#6B21A8]" />
              Dirección de envío
            </label>

            <select
              className="border border-[#C4B5FD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              onChange={(e) => {
                const selected = addresses.find(
                  (a) => a.id === Number(e.target.value)
                );
                if (selected) {
                  setSelectedAddressId(selected.id);
                  setAddressText(
                    `${selected.street}, ${selected.city}, ${selected.state || ""}, ${selected.country}, ${selected.zip_code || ""}, ${selected.phone_number || ""}`
                  );
                } else {
                  setSelectedAddressId(null);
                  setAddressText("");
                }
              }}
              value={selectedAddressId ?? ""}
            >
              <option value="">Seleccionar dirección guardada...</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.street} - {addr.city}{" "}
                  {addr.zip_code ? `(${addr.zip_code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Stripe */}
          <div className="pt-10">
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                total={totals?.total || 0}
                onPaymentSuccess={handlePayment}
              />
            </Elements>
          </div>

          {/* Métodos de pago */}
          <div className="pt-10">
            <h3 className="font-semibold mb-3 text-[#4C1D95]">Métodos de pago</h3>
            <div className="flex gap-4">
              <img className="h-10" src={visa} alt="Visa" />
              <img className="h-10" src={mastercard} alt="Mastercard" />
              <img className="h-10" src={paypal} alt="PayPal" />
              <img className="h-10" src={american_express} alt="American Express" />
            </div>
          </div>

          {rate && (
            <div className="mt-6 p-4 bg-purple-50 border border-[#DDD6FE] rounded-xl text-sm text-[#4C1D95]">
              <p>
                💰 <strong>Tipo de cambio:</strong>{" "}
                {rate.sourceCurrencyCode} → {rate.destinationCurrencyCode} ={" "}
                {rate.rate}
              </p>
              <p>Mock activo: {rate.mock ? "Sí" : "No"}</p>
            </div>
          )}
          {errorVisa && <p className="text-red-500 text-sm mt-4">{errorVisa}</p>}
        </>
      )}

      {/* Modo producto */}
      {variant === "product" && (
        <div className="pt-10">
          <Button
            onClick={async () => {
              try {
                await onAddToCart?.();

                //Redirigir al carrito
                navigate("/shoppingCart");
              } catch (err) {
                console.error("❌ Error al añadir al carrito:", err);
              }
            }}
            className="w-full bg-contrast-secondary hover:bg-main text-white shadow-md rounded-full transition-all"
          >
            Añadir al carrito
          </Button>

        </div>
      )}
    </div>
  );
}
