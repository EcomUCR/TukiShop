import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import NavBarSeller from "./components/NavBarSeller";
import HomeSeller from "./components/SellerHomeComponent";
import SellerOffers from "./components/SellerOffersComponent";
import SellerContactComponent from "./components/SellerContactComponent";
import SellerReviewsComponent from "./components/SellerReviewsComponent";
import SellerSearchPage from "./SellerSearchResults";
import { getStore } from "../infrastructure/storeService";
import type { Store } from "../../users/infrastructure/useUser";
import { SkeletonStoreHeader } from "../../../components/ui/AllSkeletons";

export default function SellerPage() {
  const { id } = useParams();
  const location = useLocation();
  const [store, setStore] = useState<Store | null>(null);
  const [view, setView] = useState<"home" | "offers" | "contact" | "reviews">("home");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col w-full">
      <NavBar />
      <div className="mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-10">
        <header className="flex flex-col justify-center w-full gap-3 py-5 sm:px-5">
          {loading ? (
            <SkeletonStoreHeader />
          ) : (
            <img
              src={store?.banner || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"}
              alt="Banner Store"
              className="w-full h-[8rem] sm:h-[15rem] object-cover rounded-xl sm:rounded-2xl"
            />
          )}

          {/* 🔹 Navbar del vendedor (mantiene diseño desktop, adaptado a mobile) */}
          <div className="overflow-x-auto sm:overflow-visible">
            <NavBarSeller setView={setView} currentView={view} id={id} />
          </div>
        </header>

        {/* 🔹 Contenido dinámico */}
        <div className="mt-2 sm:mt-4">
          {isSearchMode ? (
            <SellerSearchPage />
          ) : view === "home" ? (
            <HomeSeller />
          ) : view === "offers" ? (
            <SellerOffers />
          ) : view === "contact" ? (
            <SellerContactComponent />
          ) : view === "reviews" ? (
            <SellerReviewsComponent />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
