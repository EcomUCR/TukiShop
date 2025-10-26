import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
} from "@tabler/icons-react";
import logo from "../../img/TukiLogo.png";
import useContactForm from "../../hooks/useContactForm";

export default function Footer() {
  const { fields, handleChange, handleSubmit, loading, sent, error } =
    useContactForm();

  return (
    <footer className="h-auto py-10 bg-main text-white flex flex-col items-center font-quicksand px-6 sm:px-10 space-y-10">
      {/* Contenedor principal */}
      <div className="flex flex-col sm:flex-row w-full sm:w-[90%] justify-between items-center sm:items-start gap-15 sm:gap-0">
        {/* 🔹 Columna izquierda: enlaces + redes */}
        <div className="space-y-15 w-full sm:w-[33%] flex flex-col items-center order-2 sm:order-1">
          <div className="flex justify-center sm:justify-center mx-0 sm:mx-10 pt-0 sm:pt-10 gap-6 sm:gap-10 text-sm font-light text-center sm:text-left">
            <ul className="space-y-3 sm:mr-10">
              <li>
                <a href="/search?mode=offers">Ofertas</a>
              </li>
              <li>
                <a href="/search/stores">Tiendas</a>
              </li>
              <li>
                <a href="/search?mode=explore">Explorar</a>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <a href="/about">Conócenos</a>
              </li>
              <li>
                <a href="/beSellerPage">Vender</a>
              </li>
              <li>
                <a href="/search?mode=best-sellers">Lo más vendido</a>
              </li>
            </ul>
            <ul className="space-y-3">
              <li>
                <a href="/help">Ayuda</a>
              </li>
            </ul>
          </div>

          {/* Sigue dentro de la misma columna */}
          <div className="flex flex-col gap-3 items-center">
            <p className="font-semibold text-xl">Síguenos en</p>
            <div className="flex gap-5">
              <a
                href="https://www.facebook.com/share/17QLNhZePP/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <IconBrandFacebook />
              </a>

              <a
                href="https://www.instagram.com/tukishop_cr?igsh=MTYyeHNjcHRsbGo0ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors"
              >
                <IconBrandInstagram />
              </a>

              <a
                href="https://www.tiktok.com/@tukishopcr?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                <IconBrandTiktok />
              </a>

              <a
                href="https://x.com/TukiShopCR?s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                <IconBrandX />
              </a>
            </div>
          </div>
        </div>

        {/* 🔹 Columna central: logo */}
        <div className="flex flex-col items-center gap-2 w-full sm:w-[33%] order-1 sm:order-2">
          <img src={logo} alt="TukiShop" className="h-15 w-auto" />
          <a className="text-3xl font-fugaz" href="/">
            TukiShop
          </a>
        </div>

        {/* 🔹 Columna derecha: formulario */}
        <div className="flex flex-col gap-3 text-xs w-full sm:w-[33%] items-center pt-4 sm:pt-8 order-3 sm:order-3">
          <p className="font-semibold text-xl">Contáctanos</p>
          <form
            className="flex flex-col gap-4 w-[90%] sm:w-[80%]"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-1">
              <p className="pl-3 font-semibold">Nombre</p>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="rounded-full p-2 text-white border border-white w-full bg-transparent"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <p className="pl-3 font-semibold">Asunto</p>
              <input
                type="text"
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                placeholder="Escribe el asunto de tu mensaje"
                className="rounded-full p-2 text-white border border-white w-full bg-transparent"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <p className="pl-3 font-semibold">Email</p>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                className="rounded-full p-2 text-white border border-white w-full bg-transparent"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <p className="pl-3 font-semibold">Mensaje</p>
              <textarea
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder="Ingresa tu mensaje"
                className="rounded-2xl p-2 text-white border border-white w-full h-20 bg-transparent"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`bg-contrast-secondary cursor-pointer p-2 rounded-full hover:bg-contrast-main transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>

            {sent && (
              <p className="text-green-400 text-center">
                ¡Mensaje enviado correctamente!
              </p>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
          </form>
        </div>
      </div>

      {/* Derechos reservados */}
      <p className="text-xs text-center px-4">
        © 2025 Ecom. Todos los derechos reservados. Todas las marcas son
        propiedad de sus respectivos dueños.
      </p>
    </footer>
  );
}
