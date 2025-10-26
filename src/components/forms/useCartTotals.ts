import { useState, useEffect } from "react";
import axios from "axios";

export function useCartTotals() {
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
    total: 0,
    currency: "CRC",
    items_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");

  // 🔹 Obtener totales del backend
  const getTotals = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/totals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotals(res.data);
    } catch (err) {
      console.error("❌ Error al obtener totales:", err);
      setError("Error al obtener totales del carrito");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Limpiar carrito (intenta POST, si falla usa DELETE)
  const clearCart = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        // 1️⃣ intenta POST primero
        await axios.post(`${import.meta.env.VITE_API_URL}/cart/clear`, {}, config);
      } catch (err: any) {
        // 2️⃣ si el backend no acepta POST (405), intenta DELETE
        if (err.response?.status === 405) {
          await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, config);
        } else {
          throw err;
        }
      }

      // 3️⃣ limpia el estado local
      setTotals({
        subtotal: 0,
        taxes: 0,
        shipping: 0,
        total: 0,
        currency: "CRC",
        items_count: 0,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      console.log("🧹 Carrito limpiado correctamente");
    } catch (err) {
      console.error("❌ Error al limpiar carrito:", err);
    }
  };

  // 🔹 Cargar totales iniciales y escuchar eventos globales
  useEffect(() => {
    getTotals();
    const reload = () => getTotals();
    window.addEventListener("cartUpdated", reload);
    return () => window.removeEventListener("cartUpdated", reload);
  }, []);

  return { totals, getTotals, clearCart, loading, error };
}
