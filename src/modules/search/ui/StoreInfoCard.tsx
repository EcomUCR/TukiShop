import { Link } from "react-router-dom";
import ButtonComponent from "../../../components/ui/ButtonComponent";

interface StoreProps {
  store: {
    id: number;
    name: string;
    image?: string;
    banner?: string;
  };
}

export default function StoreInfoCard({ store }: StoreProps) {
  return (
    <>
      {/* 🌐 Versión PC */}
      <section
        className="hidden sm:flex relative w-full h-35 md:h-72 lg:h-80 rounded-2xl overflow-hidden items-center justify-center transition-all duration-500"
        style={{
          backgroundImage: `url(${store.banner || "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Fondo oscuro semitransparente */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

        {/* Contenedor principal */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center group/store w-[60%] sm:w-full px-6 sm:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-contrast-main/50 via-contrast-secondary/50 to-main/50 backdrop-blur-md w-full sm:w-96 lg:w-[30rem] h-auto sm:h-48 rounded-2xl shadow-lg border border-white/30 transition-all duration-500 sm:group-hover/store:w-[34rem] sm:group-hover/store:h-52">
            {/* 🖼 Imagen y nombre */}
            <div className="flex flex-col items-center text-center transition-all duration-500">
              <img
                src={
                  store.image ||
                  "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
                }
                alt={store.name}
                className="h-15 w-15 sm:h-20 sm:w-20 object-contain rounded-full border-2 border-white/80 shadow-lg mb-3 sm:mb-0 sm:group-hover/store:translate-x-[-7rem] transition-transform duration-500"
              />
              <h2 className="font-poiret sm:text-2xl font-semibold tracking-wide text-white drop-shadow-md sm:group-hover/store:translate-x-[-7rem] transition-all duration-500">
                {store.name}
              </h2>
            </div>

            {/* Botón (solo visible al hacer hover) */}
            <div className="hidden sm:block opacity-0 absolute translate-x-[7rem] translate-y-3 group-hover/store:opacity-100 group-hover/store:translate-y-0 transition-all duration-500">
              <Link to={`/store/${store.id}`}>
                <ButtonComponent
                  text="Visitar Tienda"
                  style="font-quicksand cursor-pointer bg-gradient-to-br from-contrast-main to-contrast-secondary text-white font-medium px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 Versión Mobile */}
      <section className="flex sm:hidden flex-col items-center gap-3 w-full font-quicksand">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-3 self-start px-2">
          <img
            src={
              store.image ||
              "https://electrogenpro.com/wp-content/themes/estore/images/placeholder-shop.jpg"
            }
            alt={store.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-main shadow-md"
          />
          <h2 className="text-lg font-semibold text-main truncate max-w-[10rem]">
            {store.name}
          </h2>
        </div>

        {/* Banner con efecto glassmorphism */}
        <div
          className="relative w-full h-27 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: `url(${store.banner || "https://via.placeholder.com/800x300"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

          <div className="relative z-10">
            <Link to={`/store/${store.id}`}>
              <button
                className="px-8 py-2 rounded-full text-white font-quicksand font-medium text-sm
                           border border-white/40 bg-gradient-to-br from-contrast-main/50 via-contrast-secondary/50 to-main/50 backdrop-blur-md shadow-lg
                           transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
              >
                Visitar
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
