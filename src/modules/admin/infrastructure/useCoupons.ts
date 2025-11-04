import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/context/AuthContext";

// 🧾 Interfaz del cupón
export interface Coupon {
  id?: number;
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  min_purchase?: number | string | null;
  max_discount?: number | string | null;
  store_id?: number | string | null;
  category_id?: number | string | null;
  product_id?: number | string | null;
  user_id?: number | string | null;
  usage_limit: number;
  usage_per_user: number;
  expires_at?: string | null;
  active: boolean;
}

export function useCoupons() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/coupons`;

  const axiosConfig = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // 🔍 Obtener cupones (admin / seller)
  const fetchCoupons = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, axiosConfig);
      setCoupons(data);
    } catch (err) {
      console.error("❌ [useCoupons] Error al obtener cupones:", err);
      setError("Error al obtener los cupones");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Crear cupón
  const createCoupon = async (coupon: Coupon) => {
    try {
      setLoading(true);
      const { data } = await axios.post(API_URL, coupon, axiosConfig);
      setCoupons((prev) => [...prev, data]);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Actualizar cupón
  const updateCoupon = async (id: number, coupon: Coupon) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`${API_URL}/${id}`, coupon, axiosConfig);
      setCoupons((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar cupón
  const deleteCoupon = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`, axiosConfig);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // 🎟️ Validar cupón público
  const validateCoupon = async (code: string, total: number, userId?: number, storeId?: number) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupons/validate`,
        {
          code,
          total,
          user_id: userId,
          store_id: storeId,
        },
        { headers: { Accept: "application/json", "Content-Type": "application/json" } }
      );
      return data;
    } catch (err: any) {
      console.error("❌ Error al validar cupón:", err.response?.data || err.message);
      return {
        valid: false,
        message: err.response?.data?.message || "Cupón inválido o expirado.",
      };
    }
  };

  useEffect(() => {
    if (token) fetchCoupons();
  }, [token]);

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
  };
}
