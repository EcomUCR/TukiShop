// 📄 src/modules/stores/pages/SearchedStores.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import StoreInfoCard from "./StoreInfoCard";
import { SkeletonStoreBanner } from "../../../components/ui/AllSkeletons";

export default function SearchedStores() {
  const [stores, setStores] = useState<any[] | null>(null); // 👈 null = sin cargar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get("/stores");

        const verifiedStores = data.filter(
          (store: any) => store.is_verified === true
        );

        setStores(verifiedStores);
      } catch (error) {
        console.error("Error al obtener tiendas:", error);
        setStores([]); // asegúrate de que haya algo para renderizar
      } finally {
        // 👇 Espera un pequeño delay para que React pinte las tiendas antes de quitar el loading
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchStores();
  }, []);

  // Si todavía no se cargó nada (stores === null), mostramos skeleton fijo
  if (stores === null || loading) {
    return (
      <div>
        <NavBar />
        <div className="max-w-6xl mx-auto my-10 flex flex-col gap-8 px-6">
          <SkeletonStoreBanner count={6} />
        </div>
        <Footer />
      </div>
    );
  }

  //Si ya cargó pero no hay tiendas
  if (stores.length === 0) {
    return (
      <div>
        <NavBar />
        <div className="max-w-6xl mx-auto my-10 px-6">
          <p className="text-center text-gray-500">
            No hay tiendas disponibles
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  //Si hay tiendas, renderízalas directamente
  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto my-10 flex flex-col  px-6">
        {stores.map((store) => (
          <div className="">
            <StoreInfoCard key={store.id} store={store} />
            <div className="relative bottom-0 left-0 w-full my-10 h-[2px] bg-gradient-to-r from-main via-contrast-secondary to-contrast-main"></div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
