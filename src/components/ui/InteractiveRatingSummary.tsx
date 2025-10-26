import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useAuth } from "../../hooks/context/AuthContext";
import { useRatings } from "../../modules/seller/infrastructure/useRatings"; // ⬅️ usa el hook
import { SkeletonRatingSummary } from "../../components/ui/AllSkeletons";
import { useAlert } from "../../hooks/context/AlertContext"; // 👈 agregado
import { useNavigate } from "react-router-dom"; // 👈 agregado

interface InteractiveRatingSummaryProps {
  onSaveReview: (review: {
    name: string;
    comment: string;
    rating: number;
  }) => void;
  storeId: number;
  barColor?: string;
}

export default function InteractiveRatingSummary({
  onSaveReview,
  storeId,
  barColor = "#ff7e47",
}: InteractiveRatingSummaryProps) {
  const { user } = useAuth();
  const { summary, loading, refreshSummary, createReview } =
    useRatings(storeId);

  const [mode, setMode] = useState<"view" | "write">("view");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const { showAlert } = useAlert(); // 👈 añadido
  const navigate = useNavigate(); // 👈 añadido

  const handleSave = async () => {
    if (!user) {
      showAlert({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para dejar una reseña",
        confirmText: "Ir al login",
        cancelText: "Cancelar",
        onConfirm: () => {
          navigate("/loginRegister");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
      return;
    }
    if (rating === 0 || !comment.trim()) {
      showAlert({
        title: "Campos incompletos",
        message: "Por favor selecciona una calificación y escribe un comentario.",
        confirmText: "Ok",
        type: "warning",
      });
      return;
    }

    try {
      await createReview({
        store_id: storeId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
        like: false,
        dislike: false,
      });

      onSaveReview({
  name:
    user.first_name || user.last_name
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : user.name || user.username || "Usuario",
  comment: comment.trim(),
  rating,
});
      await refreshSummary();
      setMode("view");
      setComment("");
      setRating(0);
      setHover(0);
    } catch (err: any) {
      console.error(
        "Error al guardar la reseña:",
        err?.response?.data || err?.message
      );
      showAlert({
        title: "Error inesperado",
        message: "Ocurrió un error al enviar la reseña.",
        confirmText: "Ok",
        type: "error",
      });
    }
  };

  const displayRating = hover > 0 ? hover : rating;

  const StarGroup = ({
    interactive = false,
    size = 20,
    value,
  }: {
    interactive?: boolean;
    size?: number;
    value?: number;
  }) => {
    const activeValue = value ?? displayRating;

    return (
      <div className="flex gap-1 justify-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const index = i + 1;
          const fillPercent = Math.max(
            0,
            Math.min(1, activeValue - (index - 1))
          );
          const widthPct = `${fillPercent * 100}%`;

          return (
            <div
              key={i}
              className={`relative ${interactive ? "cursor-pointer" : "cursor-default"
                }`}
              role={interactive ? "button" : undefined}
              aria-label={interactive ? `${index} estrellas` : undefined}
              tabIndex={interactive ? 0 : -1}
              onPointerDown={() => {
                if (interactive) {
                  setRating(index); // selección inmediata con 1 clic
                  setHover(index); // feedback instantáneo
                }
              }}
              onPointerEnter={() => interactive && setHover(index)}
              onPointerLeave={() => interactive && setHover(0)}
              onKeyDown={(e) => {
                if (!interactive) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRating(index);
                  setHover(index);
                }
              }}
            >
              <IconStar
                size={size}
                className="text-gray-300 pointer-events-none"
              />
              <div
                className="absolute left-0 top-0 overflow-hidden pointer-events-none"
                style={{ width: widthPct, height: size }}
              >
                <IconStarFilled size={size} className="text-orange-400" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <SkeletonRatingSummary show />;
  return (
    <div className="p-4 w-full font-quicksand transition-all duration-300">
      {mode === "view" ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col items-start w-1/3">
              <h2 className="text-5xl font-bold mb-1">
                {summary.average.toFixed(1)}
              </h2>
              <StarGroup size={20} value={summary.average} />{" "}
              {/* ⭐ promedio visible */}
              <p className="text-sm text-gray-500 mt-1">
                {summary.total} opiniones
              </p>
            </div>

            <div className="flex flex-col w-1/2 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star] || 0;
                const width =
                  summary.total > 0
                    ? `${(count / summary.total) * 100}%`
                    : "0%";
                return (
                  <div key={star} className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700 w-3">
                      {star}★
                    </span>
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) {
                showAlert({
                  title: "Inicia sesión",
                  message: "Debes iniciar sesión para dejar una reseña",
                  confirmText: "Ir al login",
                  cancelText: "Cancelar",
                  onConfirm: () => {
                    navigate("/loginRegister");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  },
                });
                return;
              }

              setMode("write");
            }}
            className="w-full py-3 text-white font-semibold rounded-lg transition duration-200"
            style={{ backgroundColor: barColor }}
          >
            Escribir opinión
          </button>

        </>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4 transition-all duration-300">
            <h2 className="text-6xl font-bold mb-3">
              {displayRating.toFixed(1)}
            </h2>
            <StarGroup interactive size={40} />
            <p className="text-sm text-gray-500 mt-1">Tu calificación</p>
          </div>

          <div className="mt-4 border border-main/40 rounded-lg p-3 bg-white shadow-sm">
            <label className="block mb-2 text-sm font-semibold">
              Comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2 h-20 text-base resize-none"
              placeholder="Escribe tu opinión aquí..."
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setMode("view")}
                className="px-4 py-2 rounded bg-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: barColor }}
              >
                Guardar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
