import StarRatingComponent from "../ui/StarRatingComponent";

interface LargeReviewProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
  image?: string | null;
}

export default function LargeReviewComponent({
  name,
  rating,
  comment,
  date,
  image,
}: LargeReviewProps) {
  return (
    <figure className="flex flex-col gap-5 font-quicksand mt-5">
      {/* Encabezado del usuario */}
      <div className="flex items-center gap-4">
        {image ? (
          <img
            src={image}
            className="w-10 h-10 rounded-full object-cover border border-main/30 shadow-sm"
            alt={`Foto de perfil de ${name}`}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center text-main font-semibold border border-main/30">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-semibold text-main text-sm">{name}</p>
          <StarRatingComponent value={rating} size={12} />
        </div>
      </div>

      {/* Comentario */}
      <p className="font-medium text-gray-800 leading-relaxed">{comment}</p>

      {/* Fecha y decorador */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      <div className="w-full h-[2px] bg-gradient-to-r from-main via-contrast-secondary to-contrast-main rounded-full" />
    </figure>
  );
}
