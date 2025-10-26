import { useState, useEffect } from "react";
import axios from "axios";
import { useCartTotals } from "./useCartTotals";
import { useVisa } from "../../modules/payments/useVisa";
import { useCheckout } from "../../modules/payments/useCheckout";
import visa from "../../img/resources/logo_visa.png";
import mastercard from "../../img/resources/logo_mastercard.png";
import paypal from "../../img/resources/logo_paypal.png";
import american_express from "../../img/resources/american_express_logo.png";
import { IconMapPin } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useAlert } from "../../hooks/context/AlertContext";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../../components/ui/StripePaymentForm";

// ⚙️ Stripe (solo una instancia)
const stripePromise = loadStripe(
  "pk_test_51SJQBqLl2yLxOyLIFdLhdGoXjNKpBn2WFxWjMhInw72TUbRe7DVmYLa17tBOfswYlYqe0E3J3bqYWFyuJaEFYMLI00aJOZAoJY"
);

interface FormShoppingProps {
  variant?: "checkout" | "product";
  onAddToCart?: () => void;
}

export default function FormShopping({
  variant = "checkout",
  onAddToCart,
}: FormShoppingProps) {
  const {
    getForexRate,
    rate,
    /*loading: loadingVisa*/ error: errorVisa,
  } = useVisa();
  const { processCheckout } = useCheckout();
  const { totals, getTotals, loading, error } = useCartTotals();
  const { showAlert } = useAlert();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressText, setAddressText] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    getTotals();
  }, []);

  // 🏠 Cargar direcciones
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/user/addresses");
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("❌ Error al obtener direcciones:", err);
      }
    };
    fetchAddresses();
  }, []);

  const format = (n: number) => (n ?? 0).toLocaleString("es-CR");

  // ⚙️ Validación antes del pago
  const handlePayment = async (paymentIntent: any) => {
    if (!addressText.trim()) {
      showAlert({
        title: "Dirección requerida 🏠",
        message: "Por favor escribe o selecciona una dirección antes de pagar.",
        type: "warning",
      });
      return;
    }
  

    await getForexRate("CRC", "USD");
    const selected = addresses.find((a) => a.id === selectedAddressId);
    await processCheckout(paymentIntent, totals, {
      street: selected?.street,
      city: selected?.city,
      state: selected?.state,
      zip_code: selected?.zip_code, // ✅ agregado
      country: selected?.country,
      phone_number: selected?.phone_number,
    });
  };

  return (
    <div className="font-quicksand">
      <h2 className="text-xl font-bold mb-4 text-main">
        {variant === "product"
          ? "Detalles del producto"
          : "Detalles de la compra"}
      </h2>

      {/* Totales */}
      {loading ? (
        <p className="text-gray-500 mt-5">Cargando totales...</p>
      ) : error ? (
        <p className="text-red-500 mt-5">{error}</p>
      ) : (
        <div className="flex flex-col gap-6 pt-6">
          <div className="border-t pt-5 flex justify-between">
            <p>Subtotal:</p>
            <p className="text-[#7E22CE] font-semibold">
              ₡{format(totals?.subtotal)}
            </p>
          </div>

          <div className="border-t pt-5 flex justify-between">
            <p>Impuestos (13%):</p>
            <p className="text-[#7E22CE] font-semibold">
              ₡{format(totals?.taxes)}
            </p>
          </div>

          {variant === "checkout" && (
            <div className="border-t pt-5 flex justify-between">
              <p>Envío:</p>
              <p className="text-[#7E22CE] font-semibold">
                ₡{format(totals?.shipping)}
              </p>
            </div>
          )}

          <div className="border-t pt-5 flex justify-between">
            <p className="font-bold">Total:</p>
            <p className="font-bold text-[#5B21B6]">₡{format(totals?.total)}</p>
          </div>
        </div>
      )}

      {/* Checkout */}
      {variant === "checkout" && (
        <>
          <div className="pt-10 flex flex-col gap-3 text-[#4C1D95]">
            <label className="flex items-center gap-2 text-base font-semibold">
              <IconMapPin className="text-[#6B21A8]" />
              Dirección de envío
            </label>

            {/* Dropdown */}
            <select
              className="border border-[#C4B5FD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all duration-200"
              onChange={(e) => {
                const selected = addresses.find(
                  (a) => a.id === Number(e.target.value)
                );
                if (selected) {
                  setSelectedAddressId(selected.id);
                  setAddressText(
                    `${selected.street}, ${selected.city}, ${
                      selected.state || ""
                    }, ${selected.country}, ${selected.zip_code || ""}`
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

            {/* Mostrar resumen de dirección seleccionada */}
            {selectedAddressId && (
              <div className="mt-3 p-3 bg-purple-50 border border-[#DDD6FE] rounded-lg text-sm text-[#4C1D95]">
                {(() => {
                  const a = addresses.find((a) => a.id === selectedAddressId);
                  if (!a) return null;
                  return (
                    <>
                      <p>
                        <strong>Calle:</strong> {a.street}
                      </p>
                      <p>
                        <strong>Ciudad:</strong> {a.city}
                      </p>
                      <p>
                        <strong>Provincia:</strong> {a.state}
                      </p>
                      <p>
                        <strong>Código postal:</strong> {a.zip_code || "—"}
                      </p>
                      <p>
                        <strong>País:</strong> {a.country}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {a.phone_number || "—"}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Textarea opcional */}
            <textarea
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all duration-200 ${
                !addressText.trim()
                  ? "border-red-300 focus:ring-2 focus:ring-red-400"
                  : "border-[#C4B5FD] focus:ring-2 focus:ring-[#7C3AED]"
              }`}
              placeholder="Escribe o ajusta la dirección de entrega..."
              rows={3}
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
            />
          </div>
          {/* 💳 Stripe */}
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
            <h3 className="font-semibold mb-3 text-[#4C1D95]">
              Métodos de pago
            </h3>
            <div className="flex gap-4">
              <img className="h-10" src={visa} alt="Visa" />
              <img className="h-10" src={mastercard} alt="Mastercard" />
              <img className="h-10" src={paypal} alt="PayPal" />
              <img
                className="h-10"
                src={american_express}
                alt="American Express"
              />
            </div>
          </div>
          {/* Tipo de cambio */}
          {rate && (
            <div className="mt-6 p-4 bg-purple-50 border border-[#DDD6FE] rounded-xl text-sm text-[#4C1D95]">
              <p>
                💰 <strong>Tipo de cambio:</strong> {rate.sourceCurrencyCode} →{" "}
                {rate.destinationCurrencyCode} = {rate.rate}
              </p>
              <p>Mock activo: {rate.mock ? "Sí" : "No"}</p>
            </div>
          )}
          {errorVisa && (
            <p className="text-red-500 text-sm mt-4">{errorVisa}</p>
          )}
        </>
      )}

      {/* Product Mode */}
      {variant === "product" && (
        <div className="pt-10">
          <Button
            onClick={onAddToCart}
            className="w-full bg-contrast-secondary hover:bg-main text-white shadow-md rounded-full transition-all"
          >
            Añadir al carrito
          </Button>
        </div>
      )}
    </div>
  );
}
