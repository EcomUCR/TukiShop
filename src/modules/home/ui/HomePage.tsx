import HeaderSlider from "../../../components/navigation/HeaderSlider";
import NavBar from "../../../components/layout/NavBar";
import {
  SkeletonProduct,
  SkeletonFeatured,
  SkeletonCategory,
} from "../../../components/ui/AllSkeletons";

import audifonos from "../../../img/resources/audifonos.jpg";
import FeaturedProductsSlider from "../../../components/data-display/FeaturedProductsSlider";
import { useEffect, useState } from "react";
import { useProducts } from "../../seller/infrastructure/useProducts";
import type { Product } from "../../seller/infrastructure/useProducts";
import CategorySlider from "../../../components/data-display/CategorySlider";
import ProductCard from "../../../components/data-display/ProductCard";
import { IconChevronRight } from "@tabler/icons-react";
import Footer from "../../../components/layout/Footer";
import BannerComponent from "../../../components/data-display/BannerComponent";
import { useBanner } from "../../admin/infrastructure/useBanner";

export default function HomePage() {
  const { getProducts, getFeaturedProducts } = useProducts();
  const { banners, fetchBanners, loading: loadingBanners } = useBanner();

  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /** 🔹 Cargar productos normales */
  useEffect(() => {
    (async () => {
      const prods = await getProducts();
      const discounted = prods.filter((p) => (p.discount_price ?? 0) > 0);
      setOfferProducts(discounted.slice(0, 6));
      setExploreProducts(prods.slice(0, 10));
      setLoadingOffers(false);
      setLoadingExplore(false);
    })();
  }, []);

  /** 🔹 Cargar productos destacados */
  useEffect(() => {
    (async () => {
      const prods = await getFeaturedProducts();
      setFeaturedProducts(prods);
      setLoadingFeatured(false);
    })();
  }, []);

  /** 🔹 Cargar banners desde la BD */
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-[80rem]">
        {/* 🔹 HEADER PRINCIPAL */}
        <header>
          <HeaderSlider />
        </header>

        {/* 🔹 PRODUCTOS DESTACADOS */}
        <section className=" mx-5 sm:mx-10">
          <h2 className="text-xl sm:text-2xl font-semibold font-quicksand">
            Productos destacados
          </h2>
          <div>
            {loadingFeatured ? (
              <SkeletonFeatured count={2} />
            ) : (
              <FeaturedProductsSlider
                products={featuredProducts.map((prod) => ({
                  id: prod.id!,
                  shop: prod.store?.name || "Sin tienda",
                  title: prod.name,
                  price: prod.price.toLocaleString("es-CRC"),
                  discountPrice: prod.discount_price
                    ? prod.discount_price.toLocaleString("es-CRC")
                    : "",
                  rating: 0,
                  img: prod.image_1_url || audifonos,
                }))}
              />
            )}
          </div>
        </section>

        {/* 🔹 CATEGORÍAS */}
        <section className="mx-5 sm:mx-10 sm:my-10">
          <h2 className="text-xl sm:text-2xl font-semibold font-quicksand">
            Categorías</h2>
          {loadingCategories && <SkeletonCategory count={4} />}
          <div
            className={`${loadingCategories ? "opacity-0" : "opacity-100"
              } transition-opacity duration-500`}
          >
            <CategorySlider onLoaded={() => setLoadingCategories(false)} />
          </div>
        </section>

        {/* 🔹 OFERTAS */}
        <section className="mx-4 sm:mx-10 my-6 sm:my-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
              Ofertas
            </h2>
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <a href="#" className="font-quicksand font-semibold">
                Ver todo
              </a>
              <IconChevronRight className="inline w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {loadingOffers ? (
            <SkeletonProduct count={5} />
          ) : (
            <>
              {/* Mobile: muestra solo 6 productos */}
              <div className="grid grid-cols-2 gap-4 my-6 sm:hidden">
                {offerProducts.slice(0, 6).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    id={prod.id!}
                    shop={prod.store?.name || "No hay tienda"}
                    title={prod.name}
                    price={prod.price}
                    discountPrice={
                      prod.discount_price != null && prod.discount_price !== 0
                        ? prod.discount_price
                        : undefined
                    }
                    img={prod.image_1_url ? prod.image_1_url : audifonos}
                    edit={false}
                  />
                ))}
              </div>

              {/* Escritorio: diseño original */}
              <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-10 gap-5">
                {offerProducts.slice(0, 5).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    id={prod.id!}
                    shop={prod.store?.name || "No hay tienda"}
                    title={prod.name}
                    price={prod.price}
                    discountPrice={
                      prod.discount_price != null && prod.discount_price !== 0
                        ? prod.discount_price
                        : undefined
                    }
                    img={prod.image_1_url ? prod.image_1_url : audifonos}
                    edit={false}
                  />
                ))}
              </div>
            </>
          )}
        </section>
        {/* 🔹 BANNERS desde la BD */}
        <section className="mx-4 sm:mx-10 sm:my-10 my-6">
          {loadingBanners ? (
            <p className="text-gray-500 text-center">Cargando banners...</p>
          ) : banners.length > 0 ? (
            (() => {
              const activeBanners = banners.filter(
                (b) => b.type === "SHORT" && b.is_active
              );

              if (activeBanners.length === 1) {
                // 🟡 Solo 1 → centrado
                const b = activeBanners[0];
                return (
                  <div className="flex justify-center items-center ">
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

              // 🟢 2 o más → grid centrado sin tocar el diseño original
              return (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 justify-center items-end`}>
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


        {/* 🔹 EXPLORAR */}
        <section className="mx-5 sm:mx-10 my-6 sm:my-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
              Explorar
            </h2>
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <a
                href="/search?mode=explore"
                className="font-quicksand font-semibold cursor-pointer"
              >
                Ver todo
              </a>
              <IconChevronRight className="inline w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {loadingExplore ? (
            <SkeletonProduct count={10} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-6 sm:my-10 gap-4 sm:gap-5">
              {exploreProducts.slice(0, 10).map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id!}
                  shop={prod.store?.name || 'No hay tienda'}
                  title={prod.name}
                  price={prod.price}
                  discountPrice={
                    prod.discount_price != null && prod.discount_price !== 0
                      ? prod.discount_price
                      : undefined
                  }
                  img={prod.image_1_url ? prod.image_1_url : audifonos}
                  edit={false}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      <Footer />
    </div>
  );
}
