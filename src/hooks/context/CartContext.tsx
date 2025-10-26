import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// ============================
// 🧾 Tipos del carrito
// ============================

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number | null;
    image_1_url?: string | null;
    stock?: number;
    status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
    store?: {
      id: number;
      name: string;
    };
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ============================
// ⚙️ Creación del contexto
// ============================

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ============================
  // 🔄 Obtener carrito al inicio o cambiar token
  // ============================
  useEffect(() => {
    if (token) refreshCart();
    else setCart(null);
  }, [token]);

  // ============================
  // 🔁 Cargar carrito desde backend
  // ============================
  const refreshCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { data } = await axios.get("/cart/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart ?? data);
    } catch (err) {
      console.error("Error al obtener carrito:", err);
      setCart({ id: 0, items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🛒 Agregar producto
  // ============================
  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!token) {
      console.warn("⚠️ Debes iniciar sesión para agregar al carrito.");
      return;
    }

    try {
      const { data } = await axios.post(
        "/cart/add",
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cart ?? data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error al añadir producto:", err);
    }
  };

  // ============================
  // 🔢 Actualizar cantidad
  // ============================
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!token) return;
    try {
      const { data } = await axios.patch(
        `/cart/item/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cart ?? data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
    }
  };

  // ============================
  // 🗑️ Eliminar producto
  // ============================
  const removeItem = async (itemId: number) => {
    if (!token) return;
    try {
      const { data } = await axios.delete(`/cart/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart ?? data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // ============================
  // 🧹 Vaciar carrito
  // ============================
  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.post("/cart/clear", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ id: 0, items: [], total: 0 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
    }
  };

  // ============================
  // 🧮 Cantidad total de productos
  // ============================
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================
// 🔍 Hook personalizado
// ============================
export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}
