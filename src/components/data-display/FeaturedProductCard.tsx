import { useState } from "react";
import { IconCheck, IconEdit } from "@tabler/icons-react";
import ButtonComponent from "../ui/ButtonComponent";
import RaitingComponent from "../ui/StarRatingComponent";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/context/AuthContext";
import { useAlert } from "../../hooks/context/AlertContext";
import AnimatedHeartButton from "./AnimatedHeartButton";
import { useCart } from "../../hooks/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedProductCardProps {
  id: number;
  shop: string;
  img?: string;
  title: string;
  price: string;
  discountPrice?: string;
  rating: number;
  edit: boolean;
}

export default function FeaturedProductCard(props: FeaturedProductCardProps) {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const hasDiscount = !!props.discountPrice && props.discountPrice !== "0";

  const handleAddToCart = async () => {
    if (!token) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para agregar productos al carrito",
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
      await addToCart(props.id, 1);
      setAdded(true);
      /* showAlert({
         title: "Producto añadido",
         message: "El producto fue añadido al carrito correctamente",
         type: "success",
       });*/

      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error(error);
      showAlert({
        title: "Error al añadir",
        message: "Hubo un problema al añadir el producto al carrito",
        type: "error",
      });
    }
  };

  return (
    <figure
      className={`relative w-[95%] max-w-lg h-[15rem] sm:h-full p-4 bg-light-gray rounded-2xl shadow-md overflow-hidden
      flex flex-col sm:flex-row font-quicksand transition-all duration-300
        }`}
    >
      {/* ✏️ Botón de edición */}
      {props.edit && (
        <Link
          to={`/editProduct/${props.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ButtonComponent
            style="absolute top-4 right-4 w-9 h-9 bg-contrast-main rounded-xl flex items-center cursor-pointer justify-center hover:bg-contrast-secondary hover:text-white transition-all duration-400"
            icon={<IconEdit />}
          />
        </Link>
      )}

      {/* 🖼️ Contenedor principal */}
      <div className="flex flex-row sm:flex-row w-full">
        <Link
          to={`/product/${props.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-1/2 sm:w-1/2 h-40 sm:h-60 flex items-center justify-center"
        >
          <img
            className="flex items-center w-auto h-full object-contain rounded-2xl"
            src={
              props.img ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
            }
            alt={props.title}
            loading="lazy"
          />
        </Link>

        {/* Información */}
        <div className="flex flex-col justify-between w-1/2 sm:w-1/2 pl-4 sm:pl-6 py-1">
          <p className="font-light font-poiret text-xs sm:text-base line-clamp-1">
            {props.shop}
          </p>

          <Link
            to={`/product/${props.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <h3 className="font-semibold text-xs sm:text-base leading-snug line-clamp-3">
              {props.title}
            </h3>
          </Link>

          <RaitingComponent value={props.rating} size={12} />

          <div className="mt-1">
            {hasDiscount ? (
              <>
                <p className="line-through font-comme text-xs sm:text-sm text-black/30">
                  ₡ {props.price}
                </p>
                <p className="font-comme text-base sm:text-lg">
                  ₡ {props.discountPrice}
                </p>
              </>
            ) : (
              <p className="font-comme text-base sm:text-lg font-semibold">
                ₡ {props.price}
              </p>
            )}
          </div>

          {/* 🔹 Botones desktop */}
          {!props.edit && (
            <div className="hidden sm:flex gap-2 w-full text-white mt-2">
              <motion.button
                onClick={handleAddToCart}
                initial={false}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  added
                    ? {
                      background: "linear-gradient(90deg, var(--color-contrast-secondary), var(--color-main))",
                      scale: [1, 1.05, 1],
                      boxShadow: "0 0 15px rgba(150, 80, 220, 0.6)",
                    }
                    : {
                      background: "linear-gradient(90deg, var(--color-contrast-main), var(--color-contrast-secondary))",
                      scale: 1,
                      boxShadow: "0 0 0 rgba(0,0,0,0)",
                    }
                }
                transition={{
                  duration: 0.1,
                  ease: "easeInOut",
                }}
                className="relative overflow-hidden cursor-pointer rounded-full text-sm sm:text-base transition-all duration-400 py-2 px-6 shadow-md w-full text-white"
              >
                {/* Contenedor del texto animado */}
                <div className="relative h-5 sm:h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ y: -25, opacity: 0, scale: 0.8 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          },
                        }}
                        exit={{
                          y: 25,
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute inset-0 flex items-center justify-center font-semibold"
                      >
                        <motion.div
                          initial={{ rotate: -120, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="flex items-center"
                        >
                          <IconCheck className="mr-2 text-white" size={18} />
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05, duration: 0.3 }}
                          >
                            Añadido
                          </motion.span>
                        </motion.div>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { type: "spring", stiffness: 300, damping: 18 },
                        }}
                        exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        Añadir al carrito
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>


              <AnimatedHeartButton productId={props.id} variant="filled" />
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Barra inferior (mobile) */}
      {!props.edit && (
        <div className="flex sm:hidden justify-between items-center w-full mt-3 gap-3">
          <motion.button
                onClick={handleAddToCart}
                initial={false}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  added
                    ? {
                      background: "linear-gradient(90deg, var(--color-contrast-secondary), var(--color-main))",
                      scale: [1, 1.05, 1],
                      boxShadow: "0 0 15px rgba(150, 80, 220, 0.6)",
                    }
                    : {
                      background: "linear-gradient(90deg, var(--color-contrast-main), var(--color-contrast-secondary))",
                      scale: 1,
                      boxShadow: "0 0 0 rgba(0,0,0,0)",
                    }
                }
                transition={{
                  duration: 0.1,
                  ease: "easeInOut",
                }}
                className="relative overflow-hidden cursor-pointer rounded-full text-sm sm:text-base transition-all duration-400 py-2 px-6 shadow-md w-full text-white"
              >
                {/* Contenedor del texto animado */}
                <div className="relative h-5 sm:h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ y: -25, opacity: 0, scale: 0.8 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          },
                        }}
                        exit={{
                          y: 25,
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute inset-0 flex items-center justify-center font-semibold"
                      >
                        <motion.div
                          initial={{ rotate: -120, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="flex items-center"
                        >
                          <IconCheck className="mr-2 text-white" size={18} />
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05, duration: 0.3 }}
                          >
                            Añadido
                          </motion.span>
                        </motion.div>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { type: "spring", stiffness: 300, damping: 18 },
                        }}
                        exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        Añadir al carrito
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

          <AnimatedHeartButton productId={props.id} variant="filled" />
        </div>
      )}
    </figure>
  );
}
