import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconHeart } from "@tabler/icons-react";
import { useWishlist } from "../../modules/users/infrastructure/useWishList";
import { useAuth } from "../../hooks/context/AuthContext";
import { useAlert } from "../../hooks/context/AlertContext";
import { useNavigate } from "react-router-dom";

interface AnimatedHeartButtonProps {
  productId: number;
  label?: string; // texto opcional
  variant?: "filled" | "inline"; // tipo de botón
}

export default function AnimatedHeartButton({
  productId,
  label,
  variant = "filled",
}: AnimatedHeartButtonProps) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [liked, setLiked] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const isInline = variant === "inline";

  // 🔹 Detectar si el producto ya está en la wishlist
  useEffect(() => {
    if (wishlist?.items) {
      const found = wishlist.items.find((i) => i.product.id === productId);
      if (found) {
        setLiked(true);
        setItemId(found.id);
      } else {
        setLiked(false);
        setItemId(null);
      }
    }
  }, [wishlist, productId]);

  // 🔹 Agregar / quitar producto
  const handleToggle = async () => {
    if (!token) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para usar la lista de deseos",
        confirmText: "Ir al login",
        cancelText: "Cancelar",
        onConfirm: () => {
          navigate("/loginRegister");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
      return;
    }

    try {
      setAnimating(true);
      if (liked && itemId) {
        await removeFromWishlist(itemId);
        setLiked(false);
      } else {
        await addToWishlist(productId);
        setLiked(true);
      }
      await fetchWishlist();
    } catch (err) {
      console.error("❌ Error al actualizar wishlist:", err);
    } finally {
      setTimeout(() => setAnimating(false), 400);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative inline-flex items-center gap-2 cursor-pointer select-none ${
        isInline ? "" : "inline-block"
      }`}
    >
      {/* ❤️ Icono principal */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        animate={
          animating ? { scale: [1, 1.2, 1] } : liked ? { scale: [1, 1.1, 1] } : { scale: 1 }
        }
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center ${
          isInline
            ? "text-contrast-secondary hover:text-main"
            : `w-9 h-9 rounded-xl shadow-md transition-all duration-300 ${
                liked
                  ? "bg-gradient-to-br from-contrast-main to-contrast-secondary text-white"
                  : "bg-gradient-to-br from-contrast-secondary to-contrast-main text-white hover:scale-110"
              }`
        }`}
      >
        <IconHeart
          size={isInline ? 24 : 20}
          className={`transition-colors duration-300 ${
            liked
              ? isInline
                ? "fill-red-500 text-red-500"
                : "fill-white"
              : "fill-transparent"
          }`}
        />
      </motion.div>

      {/* Texto (solo en modo inline) */}
      {isInline && label && (
        <span
          className={`text-sm w-25 font-quicksand transition-colors duration-300 hover:font-semibold hover:text-main`}
        >
          {label}
        </span>
      )}

      {/* ✨ Partículas al dar like */}
      <AnimatePresence>
        {liked && (
          <>
            {[...Array(10)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 40,
                  y: (Math.random() - 1) * 40,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-1 left-1 text-red-400 pointer-events-none select-none"
              >
                <IconHeart size={8} />
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
