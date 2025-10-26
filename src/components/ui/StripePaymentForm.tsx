import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "../ui/button";

interface StripePaymentFormProps {
  total: number; // monto total en colones o dólares
  onPaymentSuccess: (paymentIntent: any) => void;
}

export default function StripePaymentForm({
  total,
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Crear PaymentIntent en tu backend Laravel
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          amount: Math.round(total * 100), // Stripe usa la unidad más pequeña (centavos)
          currency: "crc",
        }
      );

      const clientSecret = data.clientSecret;
      if (!clientSecret) {
        throw new Error("No se recibió clientSecret del servidor.");
      }

      // 2️⃣ Confirmar pago con Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Error al procesar el pago");
      } else if (result.paymentIntent?.status === "succeeded") {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md font-quicksand">
      <label className="block mb-2 font-semibold">Tarjeta de crédito o débito</label>

      <div className="border p-3 rounded-md bg-white shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: "Quicksand, sans-serif",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

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
