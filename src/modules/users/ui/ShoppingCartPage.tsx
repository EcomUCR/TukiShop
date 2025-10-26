import Footer from "../../../components/layout/Footer";
import FormShopping from "../../../components/forms/FormShopping";
import NavBar from "../../../components/layout/NavBar";
import ProductCardShopping from "../../../components/data-display/ProductCardShopping";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { useEffect } from "react";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";
import { useCart } from "../../../hooks/context/CartContext"; // 👈 nuevo import

export default function ShoppingCartPage() {
  const { cart, loading, refreshCart } = useCart(); // 👈 usar el contexto centralizado

  // ✅ Hook para banners
  const { banners, fetchBanners, loading: loadingBanners } = useBanner();

  // ✅ Cargar banners una vez
  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Refrescar carrito al montar (solo si aún no está cargado)
  useEffect(() => {
    refreshCart();
  }, []);

  if (loading) return <p className="text-center py-10">Cargando carrito...</p>;

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
            {hasItems ? (
              cart.items.map((item) => (
                <ProductCardShopping key={item.id} item={item} />
              ))
            ) : (
              <p className="text-center font-semibold text-main text-lg py-10">
                Tu carrito está vacío
              </p>
            )}

            {/* 📞 Sección de ayuda */}
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

          {/* 💳 Formulario de pago */}
          <div className="my-5 sm:my-10 sm:pl-10 w-full sm:w-1/3">
            <FormShopping />
          </div>
        </section>

        {/* 🖼️ Banners dinámicos */}
        <section className="mx-4 sm:mx-10 sm:my-10 my-6">
          {loadingBanners ? (
            <p className="text-gray-500 text-center">Cargando banners...</p>
          ) : banners.length > 0 ? (
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

              // 🟢 2 o más banners
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
