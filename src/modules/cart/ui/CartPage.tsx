import Footer from "../../../components/layout/Footer";
import ShoppingForm from "../../../components/forms/ShoppingForm";
import NavBar from "../../../components/layout/NavBar";
import ProductCartCard from "../../cart/ui/ProductCartCard";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";
import { useCart } from "../../../hooks/context/CartContext";
import { SkeletonCartPage } from "../../../components/ui/AllSkeletons";

export default function CartPage() {
  const { cart, loading, refreshCart, clearCart } = useCart();
  const { banners, fetchBanners, loading: loadingBanners } = useBanner();
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    refreshCart();
  }, []);

  const handleClearCart = async () => {
    const confirmClear = window.confirm(
      "¿Estás seguro de que deseas vaciar tu carrito? 🗑️"
    );
    if (!confirmClear) return;

    try {
      setClearing(true);
      await clearCart();
      await refreshCart();
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
    } finally {
      setClearing(false);
    }
  };
  if (loading || loadingBanners)
    return (
      <div>
        <NavBar />
        <SkeletonCartPage />
        <Footer />
      </div>
    );

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-[80rem] px-4 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-10">
          <h1 className="text-xl sm:text-3xl font-quicksand font-bold border-b-4 border-main pb-2 w-fit">
            Mi Carrito
          </h1>
        </div>

        {/* 🛍️ Contenido principal */}
        <section className="mx-4 sm:mx-10 flex flex-col sm:flex-row">
          {/* Lista de productos */}
          <div className="my-5 w-full sm:w-2/3 sm:border-r-2 sm:pr-5 border-main flex flex-col">
        {hasItems && (
          <div className="flex justify-end mt-3">
            <button
              onClick={handleClearCart}
              disabled={clearing}
              className={`mb-4 px-6 py-2 rounded-full border-2 border-[#ff7e47] text-[#ff7e47] font-medium transition-all duration-200 
        ${
          clearing
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-[#ff7e47] hover:text-white"
        }`}
            >
              {clearing ? "Vaciando..." : "Vaciar"}
            </button>
          </div>
        )}
            {hasItems ? (
              cart.items.map((item) => (
                <ProductCartCard key={item.id} item={item} />
              ))
            ) : (
              <p className="text-center font-semibold text-main text-lg py-10">
                Tu carrito está vacío
              </p>
            )}

            <section className="flex flex-col items-center justify-center text-center py-10 font-quicksand">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                ¿Necesitas ayuda?
              </h2>
              <p className="text-sm text-gray-700 px-3 sm:px-0">
                Contáctanos de Lunes a Viernes de 8am a 6pm.
                <br />
                Sábado de 8am a 3pm.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://wa.me/50687355629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 border border-[#ff7e47] rounded-full text-[#ff7e47] hover:bg-[#ff7e47] hover:text-white transition-all duration-300"
                >
                  <IconBrandWhatsapp size={20} />
                  WhatsApp
                </a>
              </div>
            </section>
          </div>

          <div className="my-5 sm:my-10 sm:pl-10 w-full sm:w-1/3">
            <ShoppingForm />
          </div>
        </section>

        <section className="mx-4 sm:mx-10 sm:my-10 my-6">
          {banners.length > 0 ? (
            (() => {
              const activeBanners = banners.filter(
                (b) => b.type === "SHORT" && b.is_active
              );

              if (activeBanners.length === 1) {
                const b = activeBanners[0];
                return (
                  <div className="flex justify-center items-center">
                    <div className="transition-transform duration-300">
                      <BannerComponent
                        {...b}
                        image={
                          typeof b.image === "string"
                            ? b.image
                            : URL.createObjectURL(b.image)
                        }
                        character={
                          b.character
                            ? typeof b.character === "string"
                              ? b.character
                              : URL.createObjectURL(b.character)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end">
                  {activeBanners.map((b) => (
                    <div
                      key={b.id}
                      className="transition-transform duration-300 flex justify-center"
                    >
                      <BannerComponent
                        {...b}
                        image={
                          typeof b.image === "string"
                            ? b.image
                            : URL.createObjectURL(b.image)
                        }
                        character={
                          b.character
                            ? typeof b.character === "string"
                              ? b.character
                              : URL.createObjectURL(b.character)
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <p className="text-gray-500 text-center">No hay banners activos</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
