import { Link, useNavigate } from "react-router-dom";
import {
  IconBuildingStore,
  IconHeart,
  IconLogout2,
  IconSearch,
  IconShoppingBag,
  IconUser,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import logo from "../../img/TukiLogo.png";
import ButtonComponent from "../ui/ButtonComponent";
import { useAuth } from "../../hooks/context/AuthContext";
import { useProducts } from "../../modules/seller/infrastructure/useProducts";
import { useWishlist } from "../../modules/users/infrastructure/useWishList";

import { useEffect, useState } from "react";
import CategoryDropdown from "../data-display/CategoryDropdown";
import NotificationDropdown from "../data-display/NotificationDropDown";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/context/CartContext";
type Category = { id: number; name: string };

export default function NavBar() {
  const { user, logout } = useAuth();
  const { itemCount, refreshCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();

  const { getCategories } = useProducts();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const handleCartUpdate = () => refreshCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const displayName = user?.username || "";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/loginRegister", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-dropdown")) setShowUserMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-main px-4 sm:px-30 pt-4 pb-4 sm:pb-0 font-quicksand relative z-50">
      {/* Barra superior */}
      <div className="flex w-full justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white font-fugaz w-1/3 text-2xl flex items-center gap-2 p-1"
        >
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <span className="sm:block">TukiShop</span>
        </Link>

        {/* Barra de búsqueda */}
        <div className="hidden md:flex items-center bg-white rounded-full px-0.5 w-1/3">
          <input
            type="text"
            className="w-full h-10 p-3 rounded-full focus:outline-none"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <ButtonComponent
            style="bg-gradient-to-br cursor-pointer from-contrast-main to-contrast-secondary rounded-full w-12 h-9 flex items-center justify-center"
            icon={<IconSearch className="text-white h-5 w-5 stroke-3" />}
            onClick={handleSearch}
          />
        </div>

        {/* Íconos desktop */}
        <div className="hidden md:flex text-white items-center w-1/3 justify-end">
          {/* Usuario */}
          <div className="relative user-dropdown">
            {user ? (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                {/* Imagen de perfil */}
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-contain border border-white/20 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-contrast-main to-contrast-secondary flex items-center justify-center">
                    <p className="uppercase text-white font-semibold relative -top-0.25">
                      {user.username[0]}
                    </p>
                  </div>
                )}
                {/* Nombre del usuario */}
                <span className="text-sm sm:text-base">{displayName}</span>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -right-4 top-8 bg-white text-main-dark rounded-lg shadow-lg w-44 overflow-hidden"
                    >
                      <ul className="flex flex-col text-sm">
                        <li
                          onClick={() => {
                            navigate("/profile");
                            setShowUserMenu(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          <IconUser className="h-5 w-5 mr-2" /> Ver perfil
                        </li>
                        {user.role === "SELLER" && (
                          <li
                            onClick={() => {
                              navigate("/store/" + user.store?.id);
                              setShowUserMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          >
                            <IconBuildingStore className="h-5 w-5 mr-2" /> Mi
                            tienda
                          </li>
                        )}
                        <li
                          onClick={() => {
                            handleLogout();
                            setShowUserMenu(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-contrast-secondary"
                        >
                          <IconLogout2 className="h-5 w-5 mr-2" /> Cerrar sesión
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 pr-5">
                <Link
                  to="/loginRegister?mode=login"
                  className="flex items-center gap-1 hover:font-semibold"
                >
                  <IconUser className="h-5 w-5" />
                  Iniciar sesión
                </Link>
                <span>|</span>
                <Link
                  to="/loginRegister?mode=register"
                  className="hover:font-semibold"
                >
                  Regístrate
                </Link>
              </div>
            )}
          </div>

          {/* Notificaciones */}
          {user && <NotificationDropdown />}

          {/* Lista de deseos */}
          <Link to="/wishlist" className="relative pr-2">
            <IconHeart className="h-6 w-6" />
            {(wishlist?.items?.length ?? 0) > 0 && (
              <span className="absolute -top-1 right-0.5 bg-contrast-secondary text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center justify-center h-4 min-w-[1rem] px-1">
                {wishlist!.items.length > 9 ? "9+" : wishlist!.items.length}
              </span>
            )}
          </Link>

          {/* Carrito */}
          <Link to="/shoppingCart" className="relative">
            <IconShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-contrast-secondary text-white text-[10px] font-bold rounded-full px-1.5">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Íconos móviles y botón menú */}
        <div className="flex md:hidden items-center gap-3 text-white">
          {user && <NotificationDropdown />} {/* Notificaciones móviles */}
          {/* Lista de deseos */}
          <Link to="/wishlist" className="relative">
            <IconHeart className="h-6 w-6" />
          </Link>
          {/* Carrito con contador móvil */}
          <Link to="/shoppingCart" className="relative">
            <IconShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 rounded-full shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
          {/* Menú hamburguesa */}
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <IconX size={26} /> : <IconMenu2 size={26} />}
          </button>
        </div>
      </div>

      {/* Menú inferior desktop */}
      <div className="hidden md:block">
        <ul className="flex justify-center gap-10 p-4 text-white text-sm">
          <li>
            <CategoryDropdown categories={categories} navigate={navigate} />
          </li>
          <li
            onClick={() => navigate("/search?mode=explore")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Explorar
          </li>
          <li
            onClick={() => navigate("/search?mode=offers")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Ofertas
          </li>
          <li
            onClick={() => navigate("/search?mode=best-sellers")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Lo más vendido
          </li>
          <li
            onClick={() => navigate("/search/stores")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Tiendas
          </li>
          <li
            onClick={() => navigate("/beSellerPage")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Vender
          </li>
          <li
            onClick={() => navigate("/about")}
            className="hover:-translate-y-1 transition-all cursor-pointer"
          >
            Conócenos
          </li>
        </ul>
      </div>

      {/* Desplegable menú hamburguesas */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white text-main-dark rounded-2xl shadow-xl mt-3 p-4 space-y-3 font-medium"
          >
            {/* Buscador */}
            <div className="flex bg-gray-100 rounded-full px-2 py-1">
              <input
                type="text"
                className="flex-grow bg-transparent px-2 focus:outline-none text-sm"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <IconSearch
                onClick={handleSearch}
                className="h-5 w-5 cursor-pointer text-contrast-main"
              />
            </div>

            {/* Enlaces */}
            <div className="flex flex-col gap-2 text-sm">
              {/* Categorías */}
              <div className="pt-2 border-t-2">
                <CategoryDropdown categories={categories} navigate={navigate} />
              </div>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
              <Link
                to="/search?mode=explore"
                onClick={() => setMenuOpen(false)}
              >
                Explorar
              </Link>
              <Link to="/search?mode=offers" onClick={() => setMenuOpen(false)}>
                Ofertas
              </Link>
              <Link
                to="/search?mode=best-sellers"
                onClick={() => setMenuOpen(false)}
              >
                Lo más vendido
              </Link>
              <Link to="/search/stores" onClick={() => setMenuOpen(false)}>
                Tiendas
              </Link>
              <Link to="/beSellerPage" onClick={() => setMenuOpen(false)}>
                Vender
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                Conócenos
              </Link>
            </div>

            {/* Usuario */}
            <div className="border-t pt-2 mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-sm">
                    {displayName || "Usuario"}
                  </p>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    Ver perfil
                  </Link>
                  {user.role === "SELLER" && (
                    <Link
                      to={`/store/${user.store?.id}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Mi tienda
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-contrast-secondary font-semibold text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-sm">
                  <Link
                    to="/loginRegister?mode=login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/loginRegister?mode=register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Regístrate
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
