import { useEffect, useRef, useState } from "react";
import {
  IconX,
  IconBell,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../hooks/context/NotificationContext"; // 👈 nuevo import

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, loading } = useNotifications();
  const { setStoreToOpen } = useNotificationContext(); // 👈 acceso al contexto

  // Cierra al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detectar si es móvil
  const isMobile = window.innerWidth < 768;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón campana */}
      <button
        onClick={() => setOpen(!open)}
        className="relative py-2 sm:p-2 rounded-full transition cursor-pointer"
      >
        <IconBell size={22} className="text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-contrast-secondary text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center justify-center h-4 min-w-[1rem] px-1">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {/* Desktop dropdown */}
      {!isMobile && open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-main/10 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="text-main font-semibold">Notificaciones</h3>
            <button onClick={() => setOpen(false)}>
              <IconX
                size={18}
                className="text-gray-500 hover:text-main transition"
              />
            </button>
          </div>

          {/* Lista */}
          <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent">
            {loading ? (
              <p className="text-center text-gray-400 py-6 text-sm">
                Cargando...
              </p>
            ) : notifications.length > 0 ? (
              notifications.map((n) => {
                const isExpanded = expandedId === n.id;
                return (
                  <li
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-100 transition-all duration-300 ${
                      isExpanded ? "bg-main/5" : "hover:bg-main/5"
                    }`}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : n.id)}
                      className="flex justify-between items-start cursor-pointer"
                    >
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          {n.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(n.created_at).toLocaleString("es-CR")}
                        </span>
                      </div>
                      {isExpanded ? (
                        <IconChevronUp
                          size={16}
                          className="text-gray-400 mt-1"
                        />
                      ) : (
                        <IconChevronDown
                          size={16}
                          className="text-gray-400 mt-1"
                        />
                      )}
                    </div>

                    {/* Contenido expandido */}
                    {isExpanded && (
                      <div className="mt-2 p-2 rounded-md bg-gray-50 border border-gray-100 animate-fadeIn">
                        <p className="text-xs text-gray-700">{n.message}</p>

                        {n.priority && (
                          <span
                            className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              n.priority === "HIGH"
                                ? "bg-red-100 text-red-600"
                                : n.priority === "NORMAL"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            Prioridad: {n.priority}
                          </span>
                        )}

                        {/* 🚀 Botón para ir al perfil/tienda */}
                        {n.related_type === "store" &&
                          n.data &&
                          n.data.store_id && (
                            <button
                              onClick={() => {
                                const storeId = n.data!.store_id; // el "!" ya es seguro aquí
                                setStoreToOpen(storeId ?? null);
                                navigate("/profile");
                                setOpen(false);
                              }}
                              className="mt-3 text-xs text-white bg-main px-3 py-1.5 rounded-full hover:bg-contrast-secondary transition-all duration-200"
                            >
                              Ver tienda
                            </button>
                          )}
                      </div>
                    )}
                  </li>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">
                No hay notificaciones
              </p>
            )}
          </ul>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-[4.5rem] left-0 right-0 mx-auto w-[92%] bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h3 className="text-main font-semibold">Notificaciones</h3>
              <button onClick={() => setOpen(false)}>
                <IconX
                  size={20}
                  className="text-gray-500 hover:text-main transition"
                />
              </button>
            </div>

            <ul className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-main/40 scrollbar-track-transparent">
              {loading ? (
                <p className="text-center text-gray-400 py-6 text-sm">
                  Cargando...
                </p>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-3 hover:bg-main/5 cursor-pointer border-b border-gray-100 transition"
                    onClick={() => {
                      if (n.related_type === "store" && n.data?.store_id) {
                        setStoreToOpen(n.data.store_id);
                        navigate("/profile");
                        setOpen(false);
                      }
                    }}
                  >
                    <p className="text-sm text-gray-800 font-medium">
                      {n.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.created_at).toLocaleString("es-CR")}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6 text-sm">
                  No hay notificaciones
                </p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
