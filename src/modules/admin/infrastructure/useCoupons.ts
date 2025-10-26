import { useState, useEffect } from "react";
import axios from "axios";

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
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/coupons`;

  /**
   * 🔍 Obtener todos los cupones
   */
  const fetchCoupons = async () => {
    console.log("📡 [useCoupons] Cargando cupones desde:", API_URL);
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL);
      console.log("✅ [useCoupons] Cupones obtenidos:", data);
      setCoupons(data);
    } catch (err) {
      console.error("❌ [useCoupons] Error al obtener cupones:", err);
      setError("Error al obtener los cupones");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ➕ Crear nuevo cupón
   */
  const createCoupon = async (coupon: Coupon) => {
    console.log("📤 [useCoupons] Enviando cupón nuevo:", coupon);
    try {
      setLoading(true);
      const { data } = await axios.post(API_URL, coupon, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("✅ [useCoupons] Cupón creado correctamente:", data);
      setCoupons((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error("❌ [useCoupons] Error al crear cupón:", err.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✏️ Actualizar cupón existente
   */
  const updateCoupon = async (id: number, coupon: Coupon) => {
    console.log(`📤 [useCoupons] Actualizando cupón #${id}:`, coupon);
    try {
      setLoading(true);
      const { data } = await axios.put(`${API_URL}/${id}`, coupon, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("✅ [useCoupons] Cupón actualizado:", data);
      setCoupons((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err: any) {
      console.error("❌ [useCoupons] Error al actualizar cupón:", err.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🗑️ Eliminar cupón
   */
  const deleteCoupon = async (id: number) => {
    console.warn(`🗑️ [useCoupons] Eliminando cupón #${id}`);
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      console.log("✅ [useCoupons] Cupón eliminado correctamente");
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("❌ [useCoupons] Error al eliminar cupón:", err.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
}
