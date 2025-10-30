import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "../ui/button";
import { useAlert } from "../../hooks/context/AlertContext";

interface StripePaymentFormProps {
  total: number; // monto total en colones
  onPaymentSuccess: (paymentIntent: any) => void;
}

export default function StripePaymentForm({
  total,
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Validación: no permitir compras mayores a ₡800,000
    if (total > 850000) {
      showAlert({
        title: "Monto no permitido 💸",
        message:
          `El total de la compra (₡${total.toLocaleString("es-CR")}) excede el límite permitido de ₡850 000. ` +
          "Por favor reduce el monto antes de continuar.",
        type: "warning",
      });
      return; // 🔒 Detiene el flujo del pago
    }

    if (!stripe || !elements) return;

    setLoading(true);
    try {
      //Crear PaymentIntent en el backend
      const { data } = await axios.post("/create-payment-intent", {
        amount: total,
        currency: "crc",
      });

      const clientSecret = data.clientSecret;

      //Confirmar pago con Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        console.error("❌ Error en el pago:", result.error.message);
        showAlert({
          title: "Error en el pago",
          message:
            result.error.message ||
            "Hubo un problema al procesar el pago. Intenta de nuevo.",
          type: "error",
        });
      } else if (result.paymentIntent?.status === "succeeded") {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (err: any) {
      console.error("❌ Error en StripePaymentForm:", err);
      showAlert({
        title: "Error del servidor",
        message:
          err.response?.data?.message ||
          "No se pudo completar el pago. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#fa755a" },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-contrast-secondary hover:bg-main text-white"
      >
        {loading ? "Procesando..." : "Pagar ahora"}
      </Button>
    </form>
  );
}
