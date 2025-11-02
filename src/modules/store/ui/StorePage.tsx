import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import StoreNavBar from "./components/StoreNavBar";
import StoreHomeComponent from "./components/StoreHomeComponent";
import StoreOffersComponent from "./components/StoreOffersComponent";
import StoreContactComponent from "./components/StoreContactComponent";
import StoreReviewsComponent from "./components/StoreReviewsComponent";
import StoreSearchComponent from "./StoreSearchComponent";
import { getStore } from "../infrastructure/storeService";
import type { Store } from "../../users/infrastructure/useUser";
import { SkeletonStoreHeader } from "../../../components/ui/AllSkeletons";
import { IconEdit, IconSquarePlus } from "@tabler/icons-react";
import { useAuth } from "../../../hooks/context/AuthContext";
import { uploadImage } from "../../users/infrastructure/imageService";
import { updateStore } from "../infrastructure/storeService";
import { useAlert } from "../../../hooks/context/AlertContext";




export default function StorePage() {
  const { user, refreshUser } = useAuth();
  const { showAlert } = useAlert();
  const { id } = useParams();
  const location = useLocation();
  const [store, setStore] = useState<Store | null>(null);
  const [view, setView] = useState<"home" | "offers" | "contact" | "reviews">("home");
  const [loading, setLoading] = useState(true);
  const [changingBanner, setChangingBanner] = useState(false);

  const isSearchMode = location.pathname.includes("/search");

  useEffect(() => {
    if (!id) return;
    const fetchStore = async () => {
      try {
        const data = await getStore(Number(id));
        setStore(data);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !store) return;

    try {
      setChangingBanner(true);

      const bannerUrl = await uploadImage(file);

      await updateStore(store.id, { banner: bannerUrl });

      const updated = await getStore(store.id);
      setStore(updated);
      await refreshUser?.();
      showAlert({
        title: "¿Listo!",
        message: "Se ha cambiado el banner de tu tienda",
        confirmText: "Ok",
        type: "info",
      });
    } catch (error) {
      console.error("❌ Error al cambiar banner:", error);
      alert("Error al actualizar el banner. Intenta nuevamente.");
    } finally {
      setChangingBanner(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <NavBar />
      <div className="mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-10">
        <header className="flex flex-col justify-center w-full gap-3 py-5 sm:px-5 relative">
          {loading ? (
            <SkeletonStoreHeader />
          ) : (
            <div className="relative">
              {store?.user_id === user?.id && (
                <div>
                  <label className="absolute top-2 left-2 z-100 bg-contrast-secondary hover:bg-main text-white p-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center">
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      onChange={handleBannerChange}
                      className="hidden"
                      disabled={changingBanner}
                    />
                    <IconEdit size={25} />
                  </label>
                </div>
              )
              }
              <img
                src={store?.banner || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"}
                alt="Banner Store"
                className="w-full h-[8rem] sm:h-[15rem] object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          )}

          {/* 🔹 Navbar del vendedor (mantiene diseño desktop, adaptado a mobile) */}
          <div className="overflow-x-auto sm:overflow-visible">
            <StoreNavBar setView={setView} currentView={view} id={id} />
          </div>
        </header>

        {/* 🔹 Contenido dinámico */}
        <div className="mt-2 sm:mt-4">
          {isSearchMode ? (
            <StoreSearchComponent />
          ) : view === "home" ? (
            <StoreHomeComponent />
          ) : view === "offers" ? (
            <StoreOffersComponent />
          ) : view === "contact" ? (
            <StoreContactComponent />
          ) : view === "reviews" ? (
            <StoreReviewsComponent />
          ) : null}
        </div>
        {user?.store && user.store.id === store?.id && (
          <Link to="/crudProduct" className="relative group" onClick={()=> window.scrollTo({top:0,behavior:'smooth'})}>
            <button
              className="fixed flex items-center bg-main text-white p-5 rounded-full shadow-lg 
      transition-all duration-300 z-50 overflow-hidden 
      bottom-25 right-4 sm:bottom-8 sm:right-8 md:bottom-25 md:right-10 group-hover:bg-contrast-secondary"
              title="Agregar nuevo producto"
            >
              <IconSquarePlus className="group-hover:rotate-180 transition-all duration-300"/>
              <span
                className="whitespace-nowrap overflow-hidden w-0 opacity-0 transition-all duration-500 ease-in-out 
        group-hover:w-[12rem] group-hover:opacity-100"
              >
                Agregar nuevo producto
              </span>
            </button>
          </Link>
        )}


      </div>
      <Footer />
    </div>
  );
}
