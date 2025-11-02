import { useEffect, useState } from "react";
import { IconStarFilled } from "@tabler/icons-react";
import { useProducts, type ProductReview } from "../../infrastructure/useProducts";

interface StoreProductReviewListProps {
    productId: number;
}

export default function StoreProductReviewList({ productId }: StoreProductReviewListProps) {
    const { getProductReviews } = useProducts();
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Mover la función fuera de los useEffect
    const load = async () => {
        setLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data);
        setLoading(false);
    };

    // 🔹 Cargar reseñas al montar o al cambiar el producto
    useEffect(() => {
        load();
    }, [productId]);

    // 🔹 Recargar automáticamente cuando se emita el evento "reviewAdded"
    useEffect(() => {
        const reload = () => load();
        window.addEventListener("reviewAdded", reload);
        return () => window.removeEventListener("reviewAdded", reload);
    }, []);

    if (loading) {
        return <p className="text-center text-sm text-gray-500">Cargando reseñas...</p>;
    }

    if (reviews.length === 0) {
        return (
            <p className="text-center text-sm text-gray-500 mt-4">
                Aún no hay reseñas para este producto.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-6">
            {reviews.map((r) => (
                <div key={r.id} className="border-b border-main pb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={r.user?.image || "https://via.placeholder.com/40"}
                            alt={r.user?.username || "Usuario"}
                            className="w-10 h-10 rounded-full object-contain"
                        />
                        <div>
                            <p className="font-semibold text-sm">
                                {r.user?.first_name
                                    ? `${r.user.first_name} ${r.user.last_name ?? ""}`
                                    : r.user?.username || "Usuario"}
                            </p>
                            <div className="flex gap-1">
                                {Array.from({ length: r.rating }).map((_, i) => (
                                    <IconStarFilled key={i} size={14} className="text-orange-400" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm mt-2 text-gray-700">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString("es-CR")}
                    </p>
                </div>
            ))}
        </div>
    );
}
