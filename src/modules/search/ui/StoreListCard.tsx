import { Link } from "react-router-dom";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import StarRatingComponent from "../../../components/ui/StarRatingComponent";

interface StoreProps {
  store: {
    id: number;
    name: string;
    description?: string;
    category?: string;
    rating?: number;
    image?: string;
    banner?: string;
  };
}

export default function StoreListCard({ store }: StoreProps) {
  return (
    <div className="relative flex flex-col border border-white/20 bg-gradient-to-br from-contrast-main/50 via-contrast-secondary/50 to-main/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden w-full max-w-[30rem] mx-auto font-quicksand transition-all duration-300 sm:w-[35rem] min-h-[28rem] sm:min-h-[26rem]">
      <div className="relative h-24 sm:h-28 md:h-32 bg-gradient-to-r from-main via-contrast-main to-contrast-secondary">
        <img
          src={
            store.banner ??
            "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"
          }
          alt={`${store.name} banner`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute top-16 left-5 sm:top-25 sm:left-6">
        <img
          src={
            store.image ??
            "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
          }
          alt={`${store.name} logo`}
          className="w-20 h-20 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-4 bg-white border-white object-contain shadow-md"
        />
      </div>
      <div className="flex relative flex-col items-center pt-14 sm:pt-15 pb-6 px-4 text-center flex-1">
        <p className="absolute top-2 right-3 bg-white/50 text-xs text-main px-3 py-1 rounded-full">
          {store.category?.trim() || "Sin categoría"}
        </p>
        <h2 className="text-xl text-white sm:text-xl font-semibold mt-4 sm:mt-5">
          {store.name}
        </h2>
        <div className="mt-1 sm:mt-2">
          <StarRatingComponent value={store.rating ?? 0} size={16} />
        </div>
        <p className="mt-3 text-sm text-white leading-snug line-clamp-3">
          {store.description?.trim() ||
            "Esta tienda aún no ha agregado una descripción."}
        </p>
        <div className="mt-auto w-full sm:w-[80%]">
          <Link to={`/store/${store.id}`}>
            <ButtonComponent
              text="Ver tienda"
              style="cursor-pointer relative bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white font-medium rounded-full w-full py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.04] hover:brightness-110 shadow-md hover:shadow-lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
