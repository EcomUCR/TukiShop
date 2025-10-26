import { IconHeart, IconTrash } from "@tabler/icons-react";
import StarRatingComponent from "../ui/StarRatingComponent";
import { useCart } from "../../hooks/context/CartContext"; // ✅ Nuevo contexto centralizado
import { Link } from "react-router-dom";
import { useAlert } from "../../hooks/context/AlertContext";
import { useState } from "react";

interface Props {
  item: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      discount_price?: number | null;
      image_1_url?: string | null;
      stock?: number;
      status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
      rating?: number;
      store?: {
        id: number;
        name: string;
      };
    };
  };
}

export default function ProductCardShopping({ item }: Props) {
  const { product } = item;
  const { updateQuantity, removeItem } = useCart(); // ✅ Usamos funciones del CartContext
  const { showAlert } = useAlert();
  const [updating, setUpdating] = useState(false);

  const formatCRC = (n: number) =>
    n?.toLocaleString("es-CR", { style: "currency", currency: "CRC" });

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || updating) return;
    setUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      showAlert({
        title: "Ups ",
        message: "Ocurrió un error al actualizar la cantidad.",
        confirmText: "Ok",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showAlert({
      title: "Eliminar producto",
      message: "¿Deseas eliminar el producto del carrito?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "warning",
    });

    if (!confirmed) return;

    try {
      await removeItem(item.id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      showAlert({
        title: "Error al eliminar",
        message:
          "No se pudo eliminar el producto, inténtalo nuevamente más tarde.",
        confirmText: "Ok",
        type: "error",
      });
    }
  };

  const productStatus =
    product.status === "ARCHIVED"
      ? "Eliminado"
      : product.stock && product.stock > 0
      ? "Disponible"
      : "Agotado";

  const productStatusColor =
    product.status === "ARCHIVED"
      ? "text-gray-500 font-semibold"
      : product.stock && product.stock > 0
      ? "text-green-600"
      : "text-red-500 font-semibold";

  return (
    <>
      {/* 🌟 Desktop version */}
      <figure
        className="hidden sm:flex relative items-center justify-between w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-md border border-gray-100 
                  hover:border-contrast-secondary/40 transition-all duration-500 overflow-hidden mb-5 font-quicksand"
      >
        {/* Imagen */}
        <div className="flex-shrink-0 flex items-center justify-center w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-inner">
          <Link to={`/product/${product.id}`}>
            <img
              src={
                product.image_1_url ||
                "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
              }
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-500 cursor-pointer hover:scale-105"
            />
          </Link>
        </div>

        {/* Información */}
        <div className="flex flex-col justify-between flex-grow px-6 py-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-lg text-gray-800 cursor-pointer hover:text-main transition-colors">
                  {product.name}
                </h3>
              </Link>
              <span className={`text-xs ${productStatusColor}`}>
                {productStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Tienda:{" "}
              <span className="font-medium">
                {product.store?.name ?? "Sin tienda"}
              </span>
            </p>

            <StarRatingComponent value={product.rating ?? 0} size={12} />
          </div>

          {/* Cantidad */}
          <div className="mt-3 flex items-center justify-start gap-3">
            <div className="flex items-center bg-white border border-contrast-secondary/60 rounded-full shadow-sm">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updating}
                className="px-3 py-1 text-lg font-semibold text-contrast-main hover:text-contrast-secondary disabled:opacity-50 transition-colors"
              >
                −
              </button>
              <span className="px-3 text-base font-semibold text-gray-800">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updating}
                className="px-3 py-1 text-lg font-semibold text-contrast-main hover:text-contrast-secondary disabled:opacity-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Precio y acciones */}
        <div className="flex flex-col items-end justify-between h-full gap-3 pr-2">
          <div className="text-right">
            {product.discount_price && product.discount_price > 0 ? (
              <>
                <p className="text-xs line-through text-gray-400">
                  {formatCRC(product.price)}
                </p>
                <p className="text-xl font-bold text-main bg-clip-text">
                  {formatCRC(product.discount_price)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-main">
                {formatCRC(product.price)}
              </p>
            )}
          </div>

          <div className="flex gap-3 text-main">
            <button className="p-2 rounded-full bg-gradient-to-br from-contrast-main to-contrast-secondary text-white hover:scale-110 shadow-md transition-transform duration-300">
              <IconHeart size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
            >
              <IconTrash size={18} />
            </button>
          </div>
        </div>
      </figure>

      {/* 📱 Mobile version */}
      <figure
        className="sm:hidden relative w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border border-gray-100 
                  hover:border-contrast-secondary/40 transition-all duration-500 overflow-hidden mb-5 font-quicksand p-4 h-[14rem] flex flex-col justify-between"
      >
        <div className="flex w-full">
          <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-inner mr-3">
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.image_1_url ||
                  "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
                }
                alt={product.name}
                className="object-contain w-full h-full transition-transform duration-500 cursor-pointer hover:scale-105"
              />
            </Link>
          </div>

          {/* Info básica */}
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-sm text-gray-800 cursor-pointer hover:text-main transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500">
                Tienda:{" "}
                <span className="font-medium">
                  {product.store?.name ?? "Sin tienda"}
                </span>
              </p>

              <div className="flex justify-start mt-1">
                <StarRatingComponent value={product.rating ?? 0} size={10} />
              </div>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center bg-white border border-contrast-secondary/60 rounded-full shadow-sm">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updating}
                className="px-3 py-1 text-lg font-semibold text-contrast-main hover:text-contrast-secondary disabled:opacity-50 transition-colors"
              >
                −
              </button>
              <span className="px-3 text-base font-semibold text-gray-800">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updating}
                className="px-3 py-1 text-lg font-semibold text-contrast-main hover:text-contrast-secondary disabled:opacity-50 transition-colors"
              >
                +
              </button>
            </div>
            <span className={`text-base ${productStatusColor}`}>
              {productStatus}
            </span>
          </div>

          {/* Precio + acciones */}
          <div className="flex flex-col items-end gap-4">
            <p className="text-xl font-bold text-main">
              {product.discount_price && product.discount_price > 0
                ? formatCRC(product.discount_price)
                : formatCRC(product.price)}
            </p>
            <div className="flex gap-3 text-main">
              <button className="p-2 rounded-full bg-gradient-to-br from-contrast-main to-contrast-secondary text-white hover:scale-110 shadow-md transition-transform duration-300">
                <IconHeart size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
              >
                <IconTrash size={16} />
              </button>
            </div>
          </div>
        </div>
      </figure>
    </>
  );
}
