import { useState, useEffect } from "react";
import axios from "axios";
import { useCartTotals } from "./useCartTotals";
import { useProducts } from "../../modules/store/infrastructure/useProducts";
import { useCheckout } from "../../modules/cart/infraestructure/useCheckout";
import { useCoupons } from "../../modules/admin/infrastructure/useCoupons";
import { IconMapPin, IconMinus, IconPlus, IconTicket } from "@tabler/icons-react";
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
  onAddToCart?: (quantity: number) => void;
  productId?: number;
  quantity?: number;
}

export default function ShoppingForm({
  variant = "checkout",
  onAddToCart,
  productId,
  quantity = 1,
}: ShoppingFormProps) {
  const { processCheckout } = useCheckout();
  const { totals, getTotals, loading, error } = useCartTotals();
  const { getProductById } = useProducts();
  const { validateCoupon } = useCoupons();
  const { showAlert } = useAlert();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressText, setAddressText] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [localTotals, setLocalTotals] = useState<TotalsType>({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
    total: 0,
    currency: "CRC",
  });
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState<number>(quantity);

  // 🧾 Estados del cupón
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

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
          const productData = await getProductById(id);
          if (!productData || !isMounted) return;
          setProduct(productData);
          const price = productData.discount_price ?? productData.price;
          const subtotal = price * qty;
          const taxes = subtotal * 0.13;
          const total = subtotal + taxes;
          setLocalTotals({
            subtotal,
            taxes,
            shipping: 0,
            total,
            currency: "CRC",
          });
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
  }, [variant, productId, qty, token]);

  useEffect(() => {
    if (variant === "checkout") setLocalTotals(totals);
  }, [totals, variant]);

  // ============================
  // 🔹 Direcciones
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
  // 💳 Pago con Stripe
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

    await processCheckout(paymentIntent, totals, finalAddress);
  };

  // ============================
  // 🎟️ Cupón
  // ============================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await validateCoupon(couponCode, localTotals.total, user?.id);
      if (!result.valid) {
        setCouponMessage(result.message || "Cupón inválido o expirado.");
        setAppliedCoupon(null);
        setDiscount(0);
        return;
      }
      setAppliedCoupon(result.coupon);
      setDiscount(result.discount);
      setLocalTotals((prev) => ({
        ...prev,
        total: prev.total - result.discount,
        shipping:
          result.coupon?.type === "FREE_SHIPPING" ? 0 : prev.shipping ?? 0,
      }));
      setCouponMessage(`Cupón aplicado: ${result.coupon.code}`);
    } catch (err) {
      console.error("❌ Error al aplicar cupón:", err);
      setCouponMessage("Error al aplicar el cupón.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponMessage("");
    getTotals().then((res) => res && setLocalTotals(res));
  };

  // ============================
  // 🖼️ Render
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
        <>
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
            {variant === "checkout" && (localTotals?.shipping ?? 0) > 0 && (
              <div className="border-t pt-5 flex justify-between">
                <p>Envío:</p>
                <p className="text-[#7E22CE] font-semibold">
                  ₡{format(localTotals.shipping)}
                </p>
              </div>
            )}
            {discount > 0 && (
              <div className="border-t pt-5 flex justify-between text-green-600 font-semibold">
                <p>Descuento ({appliedCoupon?.code}):</p>
                <p>-₡{format(discount)}</p>
              </div>
            )}
            <div className="border-t pt-5 flex justify-between">
              <p className="font-bold">Total:</p>
              <p className="font-bold text-[#5B21B6]">
                ₡{format(localTotals?.total)}
              </p>
            </div>
          </div>

          {/* 🎟️ Campo de cupón */}
          {variant === "checkout" && (
            <div className="pt-8">
              <label className="flex items-center gap-2 font-semibold text-main mb-2">
                <IconTicket className="text-contrast-secondary" />
                Aplicar cupón
              </label>
              <div className="flex h-full py-2 gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu código"
                  className="border border-gray-300 rounded-xl h-10 px-4 w-full focus:ring-2 focus:ring-contrast-secondary outline-none"
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <Button
                    onClick={handleApplyCoupon}
                    className="bg-contrast-secondary hover:bg-main text-white rounded-xl px-6 h-10"
                  >
                    Aplicar
                  </Button>
                ) : (
                  <Button
                    onClick={handleRemoveCoupon}
                    className="bg-gray-300 hover:bg-gray-400 text-main rounded-full px-6"
                  >
                    Quitar
                  </Button>
                )}
              </div>
              {couponMessage && (
                <p
                  className={`mt-2 text-sm ${
                    discount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>
          )}

          {/* Dirección + Stripe */}
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

              <div className="pt-10">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    total={localTotals?.total || 0}
                    onPaymentSuccess={handlePayment}
                  />
                </Elements>
              </div>
            </>
          )}

          {/* 🧍 Variante producto */}
          {variant === "product" && product && (
  <div className="pt-10 flex flex-col gap-4">
    <label className="text-md font-semibold text-main text-center">
      Cantidad
    </label>

    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between w-48 bg-white border-2 border-main rounded-full px-2 py-1 shadow-sm">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-main text-white font-bold transition-all hover:bg-[#4A1F70] disabled:opacity-40"
          disabled={qty <= 1}
        >
          <IconMinus size={16} />
        </button>

        <span className="text-lg font-quicksand font-semibold text-main w-10 text-center select-none">
          {qty}
        </span>

        <button
          onClick={() => setQty((q) => q + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-main text-white font-bold transition-all hover:bg-[#4A1F70] disabled:opacity-40"
          disabled={qty >= product.stock}
        >
          <IconPlus size={16} />
        </button>
      </div>
    </div>

    <Button
      onClick={async () => {
        try {
          await onAddToCart?.(qty);
          navigate("/shoppingCart");
        } catch (err) {
          console.error("❌ Error al añadir al carrito:", err);
        }
      }}
      className="w-full bg-contrast-secondary hover:bg-main text-white shadow-md rounded-full transition-all mt-2"
    >
      Añadir {qty > 1 ? `${qty} productos` : "al carrito"}
    </Button>
  </div>
)}

        </>
      )}
    </div>
  );
}
