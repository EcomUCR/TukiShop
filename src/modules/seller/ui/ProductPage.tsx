import { useEffect, useState } from "react";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import audifonos from "../../../img/resources/audifonos.jpg";
import FormShopping from "../../../components/forms/FormShopping";
import StarRatingComponent from "../../../components/ui/StarRatingComponent";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import FeaturedProductsSlider from "../../../components/data-display/FeaturedProductsSlider";
import { IconArrowBackUp, IconChevronRight, } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../infrastructure/useProducts";
import { useProducts } from "../infrastructure/useProducts";
import {
  SkeletonProductPageMain,
  SkeletonFeaturedSlider,
  SkeletonSimilarProducts,
  SkeletonFeatured,
} from "../../../components/ui/AllSkeletons";
import ProductCard from "../../../components/data-display/ProductCard";
import { useAuth } from "../../../hooks/context/AuthContext";
import { useAlert } from "../../../hooks/context/AlertContext";
import { useNavigate } from "react-router-dom";
import AnimatedHeartButton from "../../../components/data-display/AnimatedHeartButton";
import { AnimatePresence, motion } from "framer-motion";
import ShareBubbles from "../../../components/data-display/ShareBubbles";
import { useCart } from "../../../hooks/context/CartContext";

type BorderColors = {
  description: string;
  reviews: string;
  details: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const { getProductById, getProductsByCategory, getProductsByStore } = useProducts();

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [prodStore, setProdStore] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof BorderColors>("description");

  const { token } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const prod = await getProductById(Number(id));
        setProduct(prod);
        if (prod?.store_id) {
          const storeProducts = await getProductsByStore(prod.store_id);
          setProdStore(storeProducts.filter((p) => p.id !== prod.id).slice(0, 10));
        } else {
          setProdStore([]);
        }
      } catch (err) {
        console.error("Error al cargar producto o tienda:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    })();
  }, [id]);

  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!product) return;
    (async () => {
      try {
        const categoryIds = product.categories?.map((c: any) => c.id) || [];
        if (categoryIds.length === 0) {
          setSimilarProducts([]);
          return;
        }
        const allRelated: Product[] = [];
        for (const catId of categoryIds) {
          const products = await getProductsByCategory(catId);
          allRelated.push(...products);
        }
        const unique = allRelated.filter(
          (p, i, arr) => p.id !== product.id && arr.findIndex((x) => x.id === p.id) === i
        );
        setSimilarProducts(unique.slice(0, 10));
      } catch (err) {
        console.error("Error al cargar productos similares:", err);
      }
    })();
  }, [product]);

  const handleAddToCart = async (productId: number) => {
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
      // Usamos la función addToCart del CartContext
      await addToCart(productId, 1); // Añadimos 1 unidad del producto al carrito
      showAlert({
        title: "Producto añadido",
        message: "El producto fue añadido al carrito correctamente ",
        type: "success",
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      showAlert({
        title: "Error al añadir",
        message: "Hubo un problema al añadir el producto al carrito ",
        type: "error",
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="mx-auto max-w-[80rem] w-full">
        {/*  Volver */}
        <section className="flex px-5 sm:px-10 pt-5 sm:pt-10 font-quicksand">
          <ButtonComponent
            icon={<IconArrowBackUp />}
            text="Volver"
            style="flex text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 items-center gap-2 rounded-full cursor-pointer bg-white/90 border border-main text-main hover:bg-main hover:text-white hover:scale-105 transition-all duration-300 shadow-sm"
            onClick={() => window.history.back()}
          />
        </section>

        {loading ? (
          <>
            <SkeletonProductPageMain show={loading} />
            <section className="my-10 px-10">
              <h2 className="text-2xl font-semibold font-quicksand">Más de la tienda</h2>
              <SkeletonFeaturedSlider show={loading} />
            </section>
            <section className="my-10 px-10">
              <h2 className="text-2xl font-semibold font-quicksand">Productos similares</h2>
              <SkeletonSimilarProducts show={loading} />
            </section>
          </>
        ) : (
          <>
            {product && (
              <>
                {/* ========================== */}
                {/* SECCIÓN PRINCIPAL PRODUCTO */}
                {/* ========================== */}
                <section className="flex flex-col lg:flex-row px-5 lg:px-10 pt-5 font-quicksand gap-6">
                  {/* 📄 Información principal */}
                  <div className="w-full lg:w-6/12 lg:px-20 lg:border-r-2 border-main lg:mr-5 order-1 lg:order-2 flex flex-col">
                    {/* 🔹 Título, tienda, rating */}
                    <div className="flex flex-col gap-3">
                      <h2 className="text-xl font-bold">{product.name}</h2>
                      <Link to={`/store/${product.store_id}`} className="text-xs font-bold">
                        Visitar la tienda {product.store?.name || ""}
                      </Link>
                      <div className="flex gap-2">
                        <StarRatingComponent value={product.rating || 0} size={12} />
                        <p className="text-xs">({product.rating || 0}")</p>
                      </div>
                    </div>

                    {/* 🔹 Precio */}
                    <div className="font-comme mt-4">
                      {product.discount_price && product.discount_price > 0 ? (
                        <>
                          <p className="text-xs line-through">₡{product.price}</p>
                          <p className="text-2xl font-bold text-main">₡{product.discount_price}</p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-main">₡{product.price}</p>
                      )}
                    </div>

                    {/*  Imágenes (solo visible en mobile) */}
                    <div className="flex flex-col items-center mt-6 mb-4 lg:hidden">
                      <div className="w-full flex justify-center mb-5 pb-4">
                        <div className="relative w-[18rem] h-[18rem] overflow-hidden rounded-2xl">
                          <img
                            src={selectedImage || product.image_1_url || "https://via.placeholder.com/400"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-contain transition-all duration-300 rounded-2xl"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap pb-5">
                        {[product.image_1_url, product.image_2_url, product.image_3_url]
                          .filter(Boolean)
                          .map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(img!)}
                              className={`w-20 h-20 rounded-xl overflow-hidden border-1 transition-all duration-300 ${selectedImage === img ? "border-main scale-105" : "border-transparent hover:scale-105"
                                }`}
                            >
                              <img src={img!} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover object-center" />
                            </button>
                          ))}
                      </div>


                    </div>

                    {/* Tabs de descripción / calificaciones / detalles */}
                    <div
                      className={`relative flex justify-between items-center my-10 p-2 rounded-full overflow-hidden text-sm font-quicksand transition-colors duration-500 z-0 ${activeTab === "description"
                        ? "border-1 border-main"
                        : activeTab === "reviews"
                          ? "border-1 border-contrast-secondary"
                          : "border-1 border-contrast-main"
                        }`}
                    >
                      <div
                        className={`absolute top-[4px] left-[4px] h-[calc(100%-8px)] w-1/3 rounded-full shadow-md transition-all duration-500 ease-in-out z-0 ${activeTab === "description"
                          ? "bg-main"
                          : activeTab === "reviews"
                            ? "bg-contrast-secondary"
                            : "bg-contrast-main"
                          }`}
                        style={{
                          transform:
                            activeTab === "description"
                              ? "translateX(0%)"
                              : activeTab === "reviews"
                                ? "translateX(100%)"
                                : "translateX(200%)",
                        }}
                      />
                      {["description", "reviews", "details"].map((tab) => (
                        <ButtonComponent
                          key={tab}
                          text={
                            tab === "description"
                              ? "Descripción"
                              : tab === "reviews"
                                ? "Calificaciones"
                                : "Detalles"
                          }
                          onClick={() => setActiveTab(tab as keyof BorderColors)}
                          style={`relative z-10 flex-1 py-3 rounded-full transition-all ${activeTab === tab ? "text-white font-bold" : "text-main-dark/50 hover:text-main"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Contenido tabs */}
                    <div className="relative overflow-hidden h-80">
                      <AnimatePresence mode="wait">
                        {activeTab === "description" && (
                          <motion.p
                            key="description"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0 whitespace-pre-line overflow-y-auto p-5"
                          >
                            {product.description || "Sin descripción."}
                          </motion.p>
                        )}
                        {activeTab === "reviews" && (
                          <motion.p
                            key="reviews"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0 whitespace-pre-line overflow-y-auto p-6"
                          >
                            Este producto aún no tiene calificaciones.
                          </motion.p>
                        )}
                        {activeTab === "details" && (
                          <motion.p
                            key="details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0 whitespace-pre-line overflow-y-auto p-6"
                          >
                            No se han agregado detalles adicionales para este producto.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Compartir (solo mobile, debajo de tabs) */}
                    <div className="border-t-2 w-full border-main pt-6 mt-10 block sm:hidden">
                      <div className="flex relative items-center justify-between border border-contrast-secondary rounded-full px-3 py-2">
                        <div className="flex items-center gap-2">
                          <AnimatedHeartButton
                            productId={product.id!}
                            label="Agregar a la lista de deseos"
                            variant="inline"
                          />
                        </div>

                        <div className="relative">
                          <ShareBubbles positionClass="absolute right-30 top-25" shareUrl={""} />
                        </div>
                      </div>
                    </div>

                    {/* 🛒 FormShopping (mobile debajo de wishlist, desktop al lado) */}
                    <div className="order-6 mt-6 sm:pt-0 pt-15 lg:hidden">
                      <FormShopping variant="product" onAddToCart={() => handleAddToCart(product.id!)} />
                    </div>
                  </div>

                  <div className="hidden lg:block w-3/12 pt-10 order-1">
                    <div className="flex flex-col w-full items-center">
                      <div className="w-full flex justify-center mb-5 pb-4">
                        <div className="relative w-[18rem] h-[18rem] overflow-hidden rounded-2xl">
                          <img
                            src={selectedImage || product.image_1_url || "https://via.placeholder.com/400"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-contain transition-all duration-300 rounded-2xl"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap pb-5 ">
                        {[product.image_1_url, product.image_2_url, product.image_3_url]
                          .filter(Boolean)
                          .map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(img!)}
                              className={`w-20 h-20 rounded-xl overflow-hidden border-1 transition-all duration-300 ${selectedImage === img ? "border-main scale-105" : "border-transparent hover:scale-105"
                                }`}
                            >
                              <img src={img!} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover object-center" />
                            </button>
                          ))}
                      </div>
                      <div className="border-t-2 w-72 border-main pt-10 hidden sm:block">
                        <div className="flex relative items-center justify-between border border-contrast-secondary rounded-full px-3 py-2">
                          <div className="flex items-center gap-2">
                            <AnimatedHeartButton
                              productId={product.id!}
                              label="Agregar a la lista de deseos"
                              variant="inline"
                            />
                          </div>

                          <div className="relative">
                            <ShareBubbles positionClass="absolute right-30 top-25" shareUrl={""} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🛒 FormShopping original desktop */}
                  <div className="hidden lg:block w-3/12 order-3">
                    <FormShopping variant="product" onAddToCart={() => handleAddToCart(product.id!)} />
                  </div>
                </section>

                <section className="mx-5 sm:mx-10 my-6 sm:my-10">
                  <h2 className="text-lg sm:text-2xl font-semibold font-quicksand">
                    Más de {product.store?.name || "la tienda"}
                  </h2>
                  {loading ? (
                    <SkeletonFeatured count={2} />
                  ) : prodStore.length > 0 ? (
                    <FeaturedProductsSlider
                      products={prodStore.map((prod) => ({
                        id: prod.id!,
                        shop: prod.store?.name || "Tienda",
                        title: prod.name,
                        price: prod.price.toLocaleString("es-CRC"),
                        discountPrice: prod.discount_price
                          ? prod.discount_price.toLocaleString("es-CRC")
                          : "",
                        rating: 0,
                        img: prod.image_1_url || audifonos,
                      }))}
                    />
                  ) : (
                    <p className="text-gray-500 my-5">La tienda no tiene más productos.</p>
                  )}
                </section>

                <section className="mx-4 sm:mx-10 my-6 sm:my-10">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-6 sm:my-10 gap-2 sm:gap-5">
                    {similarProducts.length > 0 ? (
                      similarProducts.slice(0, 10).map((prod) => (
                        <ProductCard
                          key={prod.id}
                          id={prod.id!}
                          shop={prod.store?.name || "Sin tienda"}
                          title={prod.name}
                          price={prod.price}
                          discountPrice={
                            prod.discount_price ? prod.discount_price : undefined
                          }
                          img={prod.image_1_url || "https://via.placeholder.com/200"}
                          edit={false}
                        />
                      ))
                    ) : (
                      <p className="col-span-5 text-center text-sm text-gray-500 font-quicksand">
                        No hay productos similares.
                      </p>
                    )}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
