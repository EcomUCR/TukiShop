import MailboxCard from "./MailboxCard";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useNotificationContext } from "../../../../hooks/context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function AdminMailBox() {
  const { notifications, loading } = useNotifications();
  const { setStoreToOpen } = useNotificationContext();
  const navigate = useNavigate();

  // 🔹 Normalizar datos de notificaciones al formato del MailboxCard
  const formattedNotifications = notifications.map((n) => {
    const type: "STORE_PENDING_VERIFICATION" | "CONTACT_MESSAGE" =
      n.type === "STORE_PENDING_VERIFICATION" || n.related_type === "store"
        ? "STORE_PENDING_VERIFICATION"
        : "CONTACT_MESSAGE";

    return {
      id: n.id,                 // <- id de la notificación
      type,
      title: n.title,
      message: n.message,
      created_at: n.created_at,
      is_read: n.is_read,
      // 👇 Enviamos también el ID REAL del contacto
      data: {
        store_id: n.data?.store_id ?? n.related_id ?? null,
        name: n.data?.name,
        subject: n.data?.subject,
        email: n.data?.email,
        message: n.data?.message,
        // ✅ Prioriza data.contact_id; si no viene, usa related_id cuando es contact_message
        contact_id:
          n?.data?.contact_id ??
          (n.related_type === "contact_message" ? n.related_id : null),
      },
    };
  });

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      <div className="pl-0 sm:pl-5">
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main w-fit">
            Buzón de administración
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-6">Cargando...</p>
        ) : formattedNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            No hay notificaciones por el momento.
          </p>
        ) : (
          formattedNotifications.map((n) => (
            <MailboxCard
              key={n.id}
              {...n}
              onViewStore={() => {
                if (n.data?.store_id) {
                  setStoreToOpen(n.data.store_id);
                  navigate("/profile");
                  window.scrollTo(0, 0);
                }
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}
