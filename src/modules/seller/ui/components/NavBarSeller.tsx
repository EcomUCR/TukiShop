import { IconSearch, IconMenu2, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { Store } from "../../../users/infrastructure/useUser";
import { getStore } from "../../infrastructure/storeService";
import { Skeleton } from "../../../../components/ui/skeleton";
import { useNavigate, useLocation } from "react-router-dom";

interface NavBarSellerProps {
  setView: (view: "home" | "offers" | "contact" | "reviews") => void;
  currentView: "home" | "offers" | "contact" | "reviews";
  id?: string | undefined;
}

export default function NavBarSeller({
  setView,
  currentView,
  id,
}: NavBarSellerProps) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!id) return;
    const fetchStore = async () => {
      try {
        const data = await getStore(Number(id));
        setStore(data);
      } catch (err) {
        console.error("Error al cargar la tienda:", err);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchStore();
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || !id) return;
    navigate(`/store/${id}/search?q=${encodeURIComponent(searchTerm)}`);
    setMenuOpen(false);
  };

  const handleViewChange = (view: "home" | "offers" | "contact" | "reviews") => {
    setView(view);
    if (location.pathname.includes("/search") && id) navigate(`/store/${id}`);
    setMenuOpen(false);
  };

  // 🦴 Skeleton
  if (loading) {
    return (
      <nav className="w-full bg-main-dark/10 text-main-dark px-10 h-20 flex justify-between items-center rounded-xl font-quicksand animate-pulse">
        <div className="w-1/3">
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <div className="flex justify-center items-center w-1/3">
          <ul className="flex gap-10 p-3">
            <li><Skeleton className="h-4 w-12 rounded-full" /></li>
            <li><Skeleton className="h-4 w-12 rounded-full" /></li>
            <li><Skeleton className="h-4 w-12 rounded-full" /></li>
            <li><Skeleton className="h-4 w-12 rounded-full" /></li>
          </ul>
        </div>
        <div className="flex items-center bg-white/50 rounded-full h-10 px-0.5 w-1/3 ml-15">
          <Skeleton className="h-6 w-full rounded-full" />
        </div>
      </nav>
    );
  }

  if (!store) return null;

  return (
    <div className="font-quicksand w-full">
      <nav className="w-full h-20 bg-main-dark/20 text-main-dark px-10 flex justify-between items-center rounded-xl sm:px-10">
        {/* 🔹 Logo */}
        <div className="w-1/3 flex items-center sm:w-1/3">
          <img
            src={store.image || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"}
            alt={store.name}
            className="h-14 w-auto object-contain"
            onClick={() => handleViewChange("home")}
          />
        </div>

        {/* 🔹 Tabs (solo desktop) */}
        <div className="hidden sm:flex justify-center items-center w-1/3">
          <ul className="flex gap-10 p-3 text-white text-sm font-medium">
            <li>
              <button
                onClick={() => handleViewChange("home")}
                className={`text-main-dark hover:-translate-y-1 transform transition-all cursor-pointer duration-300 hover:text-contrast-secondary ${
                  currentView === "home" ? "font-bold" : ""
                }`}
              >
                Tienda
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("offers")}
                className={`text-main-dark hover:-translate-y-1 transform cursor-pointer transition-all duration-300 hover:text-contrast-secondary ${
                  currentView === "offers" ? "font-bold" : ""
                }`}
              >
                Ofertas
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("contact")}
                className={`text-main-dark hover:-translate-y-1 transform cursor-pointer transition-all duration-300 hover:text-contrast-secondary ${
                  currentView === "contact" ? "font-bold" : ""
                }`}
              >
                Contacto
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("reviews")}
                className={`text-main-dark hover:-translate-y-1 transform cursor-pointer transition-all duration-300 hover:text-contrast-secondary ${
                  currentView === "reviews" ? "font-bold" : ""
                }`}
              >
                Opiniones
              </button>
            </li>
          </ul>
        </div>

        {/* 🔹 Search bar (solo desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-white rounded-full h-10 px-1 w-1/3 ml-15"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-6 p-2 text-sm focus:outline-none"
            placeholder={`Buscar en ${store.name || "la tienda"}`}
          />
          <button
            type="submit"
            className="bg-gradient-to-br from-contrast-main to-contrast-secondary rounded-full w-12 h-9 flex items-center justify-center"
          >
            <IconSearch className="text-white h-5 w-auto" />
          </button>
        </form>

        {/* 🔹 Menú hamburguesa (solo mobile) */}
        <button
          className="sm:hidden text-main-dark"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IconX className="h-7 w-7" /> : <IconMenu2 className="h-7 w-7" />}
        </button>
      </nav>

      {/* 🔹 Menú desplegable dentro del flujo */}
      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${
          menuOpen ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className=" rounded-b-xl shadow-md flex flex-col items-center gap-4 w-full">
          <ul className="flex flex-col items-center gap-3 text-main-dark text-base font-medium">
            <li>
              <button onClick={() => handleViewChange("home")}>Tienda</button>
            </li>
            <li>
              <button onClick={() => handleViewChange("offers")}>Ofertas</button>
            </li>
            <li>
              <button onClick={() => handleViewChange("contact")}>Contacto</button>
            </li>
            <li>
              <button onClick={() => handleViewChange("reviews")}>Opiniones</button>
            </li>
          </ul>

          {/* 🔍 Buscador móvil */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-main-dark/10 rounded-full h-10 px-1 w-[90%] mb-4"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-6 p-2 text-base focus:outline-none bg-transparent"
              placeholder="Buscar productos..."
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-contrast-main to-contrast-secondary rounded-full w-11 h-8 flex items-center justify-center"
            >
              <IconSearch className="text-white h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
