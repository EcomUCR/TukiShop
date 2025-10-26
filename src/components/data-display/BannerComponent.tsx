//import { Link } from "react-router-dom";
import ButtonComponent from "../ui/ButtonComponent";

interface BannerComponentProps {
  id?: number; // <-- cambia aquí
  title?: string;
  subtitle?: string;
  image: string;
  character?: string;
  link?: string;
  type: "LARGE" | "SHORT" | "SLIDER";
  position?: number;
  is_active?: boolean;
  orientation?: "LEFT" | "RIGTH";
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  edit?: boolean;
}

export default function BannerComponent(props: BannerComponentProps) {
  const getButtonColor = () => {
    switch (props.btn_color) {
      case "MORADO":
        return "bg-main";
      case "AMARILLO":
        return "bg-contrast-main";
      case "NARANJA":
        return "bg-contrast-secondary";
      case "GRADIENTE":
        return "bg-gradient-to-br from-contrast-main via-contrast-secondary to-main";
      default:
        return "bg-main";
    }
  };

  // 🔹 Banner SLIDER (no se toca)
  if (props.type === "SLIDER") {
    return (
      <img
        src={props.image}
        alt={props.title ?? `Banner ${props.id}`}
        className="w-[90%] h-[80%] object-cover rounded-3xl"
      />
    );
  }

  // 🔹 Banner LARGE (no se toca)
  if (props.type === "LARGE") {
    return <section>desarrollo el banner de orientacion 2</section>;
  }

  // 🔹 Banner corto LEFT
  if (props.type === "SHORT" && props.orientation === "LEFT") {
    return (
      <div className="w-[35rem] h-[12rem] sm:h-[17rem] flex items-end rounded-t-3xl rounded-b-2xl overflow-hidden relative transform sm:scale-100 max-w-full mx-auto">
        <div className="flex w-full absolute z-1 h-full sm:h-[16rem]">
          <div className="w-[50%] h-full flex flex-col justify-between py-3 sm:py-8 pl-5">
            <div className="text-left text-white text-lg sm:text-3xl font-quicksand font-bold">
              {props.title ?? "Todo, a un click de distancia"}
            </div>
            <div className="text-left text-white text-xs sm:text-base font-quicksand">
              {props.subtitle ??
                "Explora la gran cantidad de productos de tiendas nacionales."}
            </div>
            {props.btn_text && (
              <div>
                <ButtonComponent
                  text={props.btn_text ?? "Ver Productos"}
                  style={`px-2 truncate font-quicksand cursor-pointer text-sm sm:text-base text-white font-medium w-35 sm:w-45 py-2 rounded-b-lg rounded-t-3xl shadow-lg hover:scale-105 transition-transform duration-300 ${getButtonColor()}`}
                  onClick={() => {
                    if (props.link) {
                      if (props.link.startsWith("http")) {
                        window.open(props.link, "_blank");
                      } else {
                        window.location.href = props.link;
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative w-[50%] flex justify-center items-end overflow-visible">
            <img
              src={props.character}
              alt={props.title ?? `Banner ${props.id}`}
              className="absolute w-full sm:h-[17.5rem] object-contain -bottom-2 z-0"
            />
          </div>
        </div>

        <img
          src={props.image}
          alt={props.title ?? `Banner ${props.id}`}
          className="w-[35rem] h-[16.5rem] object-cover absolute rounded-t-3xl -bottom-2 z-0"
        />
      </div>
    );
  }

  // 🔹 Banner corto RIGHT
  if (props.type === "SHORT" && props.orientation === "RIGTH") {
    return (
      <div className="w-[35rem] h-[12rem] sm:h-[17rem] flex items-end rounded-t-3xl rounded-b-2xl overflow-hidden relative transform sm:scale-100 max-w-full mx-auto">
        <div className="flex w-full absolute z-1 h-full sm:h-[16rem]">
          <div className="relative w-[50%] flex justify-center items-end overflow-visible">
            <img
              src={props.character}
              alt={props.title ?? `Banner ${props.id}`}
              className="absolute w-full sm:h-[17.5rem] object-contain -bottom-4 z-0"
            />
          </div>

          <div className="w-[50%] h-full flex flex-col justify-between py-3 sm:py-8 pl-5">
            <div className="text-left text-white text-lg sm:text-3xl font-quicksand font-bold">
              {props.title ?? "Encuentra todo para tu perro."}
            </div>
            <div className="text-left text-white text-xs sm:text-base font-quicksand">
              {props.subtitle ??
                "Alimentos, juguetes, premios y más para su bienestar."}
            </div>

            {props.btn_text && (
              <div>
                <ButtonComponent
                  text={props.btn_text ?? "Ver Productos"}
                  style={`px-2 truncate font-quicksand cursor-pointer text-sm sm:text-base text-white font-medium w-35 sm:w-45 py-2 rounded-b-lg rounded-t-3xl shadow-lg hover:scale-105 transition-transform duration-300 ${getButtonColor()}`}
                  onClick={() => {
                    if (props.link) {
                      if (props.link.startsWith("http")) {
                        window.open(props.link, "_blank");
                      } else {
                        window.location.href = props.link;
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <img
          src={props.image}
          alt={props.title ?? `Banner ${props.id}`}
          className="w-[35rem] h-[16.5rem] object-cover absolute rounded-t-3xl -bottom-2 z-0"
        />
      </div>
    );
  }
}
