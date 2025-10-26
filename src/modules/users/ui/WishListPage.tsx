import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import ProductCardWishList from "../../../components/data-display/ProductCardWishList";
import ShareBubbles from "../../../components/data-display/ShareBubbles";
import { useWishlist } from "../infrastructure/useWishList";

export default function WishListPage() {
  const { slug } = useParams(); // Si viene slug => modo público
  const {
    wishlist,
    fetchWishlist,
    getPublicWishlist,
    removeFromWishlist,
    toggleVisibility,
    loading,
  } = useWishlist();

  const isPublicMode = Boolean(slug);

  useEffect(() => {
    if (isPublicMode && slug) {
      getPublicWishlist(slug);
    } else {
      fetchWishlist();
    }
  }, [slug]);

  if (loading)
    return <p className="text-center py-10">Cargando wishlist...</p>;

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-[80rem] px-4 sm:px-10">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-10">
          <h1 className="text-xl sm:text-3xl font-quicksand font-bold border-b-4 border-main pb-2 w-fit">
            {isPublicMode
              ? `Lista de deseos de ${wishlist?.user?.username ?? "usuario"}`
              : "Mi lista de deseos"}
          </h1>

          {!isPublicMode && wishlist && (
            <button
              onClick={toggleVisibility}
              className={`text-sm px-4 py-2 rounded-full border font-semibold transition-all duration-300 ${
                wishlist.is_public
                  ? "bg-green-100 border-green-400 text-green-700 hover:bg-green-200"
                  : "bg-red-100 border-red-400 text-red-700 hover:bg-red-200"
              }`}
            >
              {wishlist.is_public
                ? "Visible públicamente"
                : "Lista privada"}
            </button>
          )}
        </div>

        {/* Lista de productos */}
        <section className="mt-6 flex flex-col gap-4">
          {wishlist?.items?.length ? (
            wishlist.items.map((item) => (
              <ProductCardWishList
                key={item.id}
                product={{
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  discount_price: item.product.discount_price,
                  stock: item.product.stock,
                  image_1_url: item.product.image_1_url,
                  store_name: item.product.store?.name,
                }}
                onDelete={
                  isPublicMode ? undefined : () => removeFromWishlist(item.id)
                }
                onAddToCart={
                  isPublicMode
                    ? undefined
                    : (p) => console.log("Agregar al carrito:", p)
                }
                isPublicMode={isPublicMode} // ✅ agregado
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              {isPublicMode
                ? "Esta lista está vacía o es privada"
                : "Tu lista de deseos está vacía"}
            </p>
          )}
        </section>

        {/* Compartir */}
        {!isPublicMode && wishlist && (
          <section className="flex flex-col items-center justify-center text-center py-10 font-quicksand px-4 sm:px-0">
            <h3 className="text-lg sm:text-xl font-semibold text-main-dark mb-3">
              ¡Compartí tu wishlist con tus amigos!
            </h3>
            <p className="text-main-dark/50 text-sm mb-5 max-w-md">
              Envía tu lista de deseos para que otros puedan ver tus productos
              favoritos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto items-center justify-center border-contrast-secondary border-2 py-2 px-10 sm:py-3 rounded-full">
              <ShareBubbles
                positionClass="absolute right-3 top-25"
                shareUrl={`${window.location.origin}/wishlist/public/${wishlist.slug}`} // ✅ ruta corregida
              />
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
