import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

/* ============================================================
   💎 Skeleton con efecto de desvanecimiento (Fade-out global)
   ============================================================ */
function FadeWrapper({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(show);
  const [opacity, setOpacity] = useState(show ? "opacity-100" : "opacity-0");

  useEffect(() => {
    if (show) {
      setVisible(true);
      setOpacity("opacity-100");
    } else {
      setOpacity("opacity-0");
      const timer = setTimeout(() => setVisible(false), 600); // coincide con duration-700
      return () => clearTimeout(timer);
    }
  }, [show]);

  return visible ? (
    <div className={`transition-opacity duration-700 ease-in-out ${opacity}`}>
      {children}
    </div>
  ) : null;
}
export const SkeletonSellerContact: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="flex flex-col mx-10 my-5 font-quicksand animate-pulse">
      {/* 🔹 Logo + Descripción */}
      <div className="flex items-center justify-center">
        {/* Logo */}
        <div className="flex items-center w-[40%] justify-center">
          <Skeleton className="w-[180px] h-[180px] rounded-xl bg-gray-300/70" />
        </div>

        {/* Descripción */}
        <div className="flex flex-col text-center w-[60%] gap-5">
          <Skeleton className="w-1/2 h-[28px] mx-auto rounded-md bg-gray-300/70" />
          <Skeleton className="w-3/4 h-[16px] mx-auto rounded-md bg-gray-300/70" />
          <Skeleton className="w-2/3 h-[16px] mx-auto rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[16px] mx-auto rounded-md bg-gray-300/70" />
        </div>
      </div>

      {/* 🔹 Contacto / Dirección / Redes */}
      <div className="grid grid-cols-3 justify-items-center mt-20">
        {/* Contacto */}
        <div className="flex flex-col gap-3 w-2/3 items-start">
          <Skeleton className="w-[120px] h-[24px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-[160px] h-[14px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-[200px] h-[14px] rounded-md bg-gray-300/70" />
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-3 w-2/3 items-start">
          <Skeleton className="w-[120px] h-[24px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-[220px] h-[14px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-[180px] h-[14px] rounded-md bg-gray-300/70" />
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col gap-3 pb-10 w-2/3 items-start">
          <Skeleton className="w-[160px] h-[24px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-[140px] h-[14px] rounded-md bg-gray-300/70" />
          <div className="flex gap-5 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[30px] h-[30px] rounded-full bg-gray-300/70"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </FadeWrapper>
);

export const SkeletonRatingSummary: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="p-4 w-full font-quicksand animate-pulse">
      <div className="flex justify-between items-start mb-4">
        {/* 🔹 Promedio y estrellas */}
        <div className="flex flex-col items-start w-1/3">
          <Skeleton className="w-[70px] h-[40px] rounded-md bg-gray-300/70 mb-2" />
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[20px] h-[20px] rounded-full bg-gray-300/70"
              />
            ))}
          </div>
          <Skeleton className="w-[80px] h-[14px] rounded-md bg-gray-300/70" />
        </div>

        {/* 🔹 Barras de distribución */}
        <div className="flex flex-col w-1/2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Skeleton className="w-[20px] h-[14px] rounded-md bg-gray-300/70" />
              <Skeleton className="flex-grow h-[8px] rounded-full bg-gray-300/70" />
              <Skeleton className="w-[20px] h-[14px] rounded-md bg-gray-300/70" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="w-full h-[42px] rounded-lg bg-gray-300/70" />
    </div>
  </FadeWrapper>
);
export const SkeletonStoreBanner = ({
  count = 3,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="flex flex-col gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative w-full h-56 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200/60 shadow-md animate-pulse"
        >
          {/* Fondo simulado */}
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-300/70" />

          {/* Contenedor glass */}
          <div className="relative z-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 px-10 py-6">
            <div className="flex items-center gap-5">
              {/* Imagen circular */}
              <Skeleton className="w-[80px] h-[80px] rounded-full bg-gray-300/70" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-[140px] h-[20px] rounded-md bg-gray-300/70" />
                <Skeleton className="w-[100px] h-[14px] rounded-md bg-gray-300/70" />
              </div>
            </div>
            {/* Botón placeholder */}
            <div className="absolute right-10">
              <Skeleton className="w-[120px] h-[36px] rounded-full bg-gray-300/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);
export const SkeletonSellerReviews: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <section className="mx-10 my-5 font-quicksand animate-pulse">
      <div className="flex justify-between items-center mb-5">
        <Skeleton className="w-1/3 h-[28px] rounded-md bg-gray-300/70" />
        <Skeleton className="w-[80px] h-[28px] rounded-full bg-gray-300/70" />
      </div>

      <div className="flex w-full gap-10">
        {/* 🔸 Columna izquierda: resumen/formulario */}
        <div className="flex flex-col w-[35%] border border-main rounded-2xl p-4 bg-white">
          <div className="flex flex-col items-center mb-4">
            <Skeleton className="w-[60px] h-[60px] rounded-full mb-3 bg-gray-300/70" />
            <Skeleton className="w-1/3 h-[20px] mb-2 rounded-md bg-gray-300/70" />
            <Skeleton className="w-1/2 h-[14px] rounded-md bg-gray-300/70" />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-5 h-3 rounded-full bg-gray-300/70" />
                <Skeleton className="w-full h-2 rounded-full bg-gray-300/70" />
              </div>
            ))}
          </div>

          <Skeleton className="w-full h-[40px] rounded-lg bg-gray-300/70 mt-4" />
        </div>

        {/* 🔹 Columna derecha: reseñas */}
        <div className="flex flex-col w-[65%] pl-10">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-[100px] h-[20px] rounded-md bg-gray-300/70" />
            <Skeleton className="w-[40px] h-[20px] rounded-full bg-gray-300/70" />
          </div>

          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border border-main/20 rounded-2xl p-4 shadow-sm bg-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-[40px] h-[40px] rounded-full bg-gray-300/70" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-[120px] h-[14px] rounded-md bg-gray-300/70" />
                    <Skeleton className="w-[80px] h-[12px] rounded-md bg-gray-300/70" />
                  </div>
                </div>
                <Skeleton className="w-full h-[14px] mb-2 rounded-md bg-gray-300/70" />
                <Skeleton className="w-3/4 h-[14px] mb-2 rounded-md bg-gray-300/70" />
                <Skeleton className="w-2/3 h-[14px] rounded-md bg-gray-300/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </FadeWrapper>
);

/* ============================================================
   💎 Skeleton para productos normales (tarjetas verticales)
   ============================================================ */
export const SkeletonProduct = ({
  count = 5,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-5 my-10 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[340px] w-full p-3 bg-light-gray rounded-2xl shadow-md"
        >
          <Skeleton className="w-full h-[180px] rounded-2xl mb-4 bg-gray-300/70" />
          <Skeleton className="w-4/5 h-[16px] mx-auto mb-2 rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[12px] mx-auto mb-3 rounded-md bg-gray-300/70" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="w-1/2 h-[14px] rounded-md bg-gray-300/70" />
            <Skeleton className="w-2/3 h-[14px] rounded-md bg-gray-300/70" />
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   ⭐ Skeleton para productos destacados (tarjetas horizontales)
   ============================================================ */
export const SkeletonFeatured = ({
  count = 2,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="flex gap-8 overflow-hidden mt-6 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative w-[600px] p-5 bg-light-gray rounded-2xl shadow-md overflow-hidden flex font-quicksand"
        >
          <div className="w-1/2 flex items-center justify-center">
            <Skeleton className="w-[90%] h-[230px] rounded-2xl bg-gray-300/70" />
          </div>
          <div className="flex flex-col justify-between w-1/2 pl-6 py-1">
            <Skeleton className="w-2/3 h-[14px] mb-2 rounded-md bg-gray-300/70" />
            <Skeleton className="w-4/5 h-[20px] mb-4 rounded-md bg-gray-300/70" />
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className="w-[12px] h-[12px] rounded-full bg-gray-300/70"
                />
              ))}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Skeleton className="w-1/2 h-[14px] rounded-md bg-gray-300/70" />
              <Skeleton className="w-2/3 h-[14px] rounded-md bg-gray-300/70" />
            </div>
            <div className="flex gap-2 w-full">
              <Skeleton className="w-full h-[38px] rounded-full bg-gray-300/70" />
              <Skeleton className="w-[45px] h-[38px] rounded-full bg-gray-300/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   🧭 Skeleton para categorías (CategoryCard)
   ============================================================ */
export const SkeletonCategory = ({
  count = 4,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-4 gap-6 my-10 justify-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative w-55 h-22 flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-md bg-light-gray"
        >
          <Skeleton className="absolute inset-0 w-full h-full rounded-2xl bg-gray-300/70" />
          <Skeleton className="w-[40px] h-[40px] rounded-full bg-gray-300/70 z-10 mb-2" />
          <Skeleton className="w-[80px] h-[14px] rounded-md bg-gray-300/70 z-10" />
        </div>
      ))}
    </div>
  </FadeWrapper>
);
/* ============================================================
   🧩 Skeleton de página de producto completo
   ============================================================ */
export const SkeletonProductPageMain = ({
  show = true,
}: {
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="flex px-10 pt-10 font-quicksand animate-pulse gap-10">
      {/* 🔹 Imagen principal + botones de acción */}
      <div className="w-3/12 flex flex-col gap-6">
        <Skeleton className="w-full h-[350px] rounded-2xl bg-gray-300/70" />
        <div className="border-t-2 border-main pt-6">
          <div className="flex justify-between gap-2">
            <Skeleton className="w-1/2 h-[40px] rounded-full bg-gray-300/70" />
            <Skeleton className="w-1/2 h-[40px] rounded-full bg-gray-300/70" />
          </div>
        </div>
      </div>

      {/* 🔹 Columna central (nombre, precio, tabs, descripción) */}
      <div className="w-6/12 px-10 border-r-2 border-main mr-5">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-3/4 h-[28px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/3 h-[18px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/4 h-[16px] rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[32px] rounded-md bg-gray-300/70" />
        </div>

        {/* Tabs */}
        <div className="flex justify-between my-10">
          <Skeleton className="w-[120px] h-[40px] rounded-full bg-gray-300/70" />
          <Skeleton className="w-[120px] h-[40px] rounded-full bg-gray-300/70" />
          <Skeleton className="w-[120px] h-[40px] rounded-full bg-gray-300/70" />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-[14px] rounded-md bg-gray-300/70"
            />
          ))}
        </div>
      </div>

      {/* 🔹 Columna de compra (FormShopping) */}
      <div className="w-3/12 flex flex-col gap-4">
        <Skeleton className="w-full h-[260px] rounded-2xl bg-gray-300/70" />
        <Skeleton className="w-full h-[50px] rounded-full bg-gray-300/70" />
        <Skeleton className="w-full h-[50px] rounded-full bg-gray-300/70" />
      </div>
    </div>
  </FadeWrapper>
);

/* ============================================================
   🎠 Skeleton del slider de productos destacados
   ============================================================ */
export const SkeletonFeaturedSlider = ({ show = true }: { show?: boolean }) => (
  <FadeWrapper show={show}>
    <div className="flex gap-8 overflow-hidden mt-6 justify-center animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative w-[300px] p-3 bg-light-gray rounded-2xl shadow-md overflow-hidden flex flex-col"
        >
          <Skeleton className="w-full h-[160px] rounded-2xl mb-4 bg-gray-300/70" />
          <Skeleton className="w-4/5 h-[16px] mb-2 rounded-md bg-gray-300/70 mx-auto" />
          <Skeleton className="w-1/2 h-[14px] mb-2 rounded-md bg-gray-300/70 mx-auto" />
          <Skeleton className="w-2/3 h-[14px] mb-2 rounded-md bg-gray-300/70 mx-auto" />
        </div>
      ))}
    </div>
  </FadeWrapper>
);

/* ============================================================
   🛒 Skeleton de productos similares
   ============================================================ */
export const SkeletonSimilarProducts = ({
  show = true,
}: {
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-5 gap-5 my-10 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[320px] w-full p-3 bg-light-gray rounded-2xl shadow-md"
        >
          <Skeleton className="w-full h-[180px] rounded-2xl mb-4 bg-gray-300/70" />
          <Skeleton className="w-4/5 h-[16px] mx-auto mb-2 rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[12px] mx-auto mb-3 rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[14px] rounded-md mx-auto bg-gray-300/70" />
        </div>
      ))}
    </div>
  </FadeWrapper>

  
);
export const SkeletonHeaderSlider: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="relative mx-10 h-[30rem] flex items-center justify-center animate-pulse">
      {/* 🔹 Rectángulo principal simulando el banner */}
      <Skeleton className="w-[90%] h-[80%] rounded-3xl bg-gray-300/70 shadow-md" />

      {/* 🔹 Botón izquierdo (simulación de CarouselPrevious) */}
      <div className="absolute left-6 flex items-center justify-center">
        <Skeleton className="w-[44px] h-[44px] rounded-full bg-gray-300/70 shadow" />
      </div>

      {/* 🔹 Botón derecho (simulación de CarouselNext) */}
      <div className="absolute right-6 flex items-center justify-center">
        <Skeleton className="w-[44px] h-[44px] rounded-full bg-gray-300/70 shadow" />
      </div>
    </div>
  </FadeWrapper>
);

export const SkeletonPersonalProduct = ({
  count = 5,
  show = true,
}: {
  count?: number;
  show?: boolean;
}) => (
  <FadeWrapper show={show}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-6 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-[340px] w-full p-3 bg-light-gray rounded-2xl shadow-md animate-pulse"
        >
          <Skeleton className="w-full h-[180px] rounded-2xl mb-4 bg-gray-300/70" />
          <Skeleton className="w-4/5 h-[16px] mx-auto mb-2 rounded-md bg-gray-300/70" />
          <Skeleton className="w-1/2 h-[12px] mx-auto mb-3 rounded-md bg-gray-300/70" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="w-1/2 h-[14px] rounded-md bg-gray-300/70" />
            <Skeleton className="w-2/3 h-[14px] rounded-md bg-gray-300/70" />
          </div>
        </div>
      ))}
    </div>
  </FadeWrapper>
);
export const SkeletonStoreHeader: React.FC<{ show?: boolean }> = ({
  show = true,
}) => (
  <FadeWrapper show={show}>
    <div className="w-full h-[15rem] px-5 animate-pulse">
      <Skeleton className="w-full h-full rounded-2xl bg-gray-300/70" />
    </div>
  </FadeWrapper>
);
