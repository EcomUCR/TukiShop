import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeClosed } from "@tabler/icons-react"; // 👁️ Importados aquí
import { useAuth } from "../../../hooks/context/AuthContext";
import useRegister from "../../auth/infrastructure/useRegister";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import logo from "../../../img/TukiLogo.png";

export default function RegisterSellerPage() {
  const { register, loading: registering, error } = useRegister();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // 👁️ Estados de visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    setRegisterError(null);
    try {
      await register({
        username: form.username.toLowerCase(),
        email: form.email.toLowerCase(),
        password: form.password,
        phone_number: form.phone_number,
        role: "SELLER",
      });

      const loginSuccess = await login(form.email.toLowerCase(), form.password);
      if (loginSuccess) navigate("/");
    } catch (err: any) {
      setRegisterError(
        err.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  return (
    <div>
      <NavBar />

      {/* Contenedor principal */}
      <section className="flex flex-col sm:flex-row justify-center items-center min-h-[90vh]">
        {/* 🔹 Lado izquierdo (degradado) */}
        <div className="relative flex flex-col justify-center bg-gradient-to-br from-contrast-main via-contrast-secondary to-main h-[20vh] sm:h-[90vh] w-full sm:w-[35%] gap-4">
          <div className="bg-white absolute sm:right-0 sm:top-40 sm:h-30 sm:w-65 rounded-l-full transform transition-all duration-300 hidden sm:block">
            <div className="-rotate-90 absolute w-10 h-10 -top-6 -right-4 bg-transparent flex items-center justify-center rounded-2xl">
              <div className="absolute w-full h-full border-l-[1rem] border-b-[1rem] border-white rounded-bl-[6rem]"></div>
            </div>
            <div className="-rotate-180 absolute w-10 h-10 -bottom-6 -right-4 bg-transparent flex items-center justify-center rounded-2xl">
              <div className="absolute w-full h-full border-l-[1rem] border-b-[1rem] border-white rounded-bl-[6rem]"></div>
            </div>
            <h1 className="font-quicksand z-10 text-xl font-semibold py-11 rounded-full absolute text-contrast-secondary right-10">
              Registrar tienda
            </h1>
          </div>

          {/* Título mobile */}
          <div className="sm:hidden flex flex-col justify-center items-center gap-5">
            <h1 className="text-white text-2xl font-quicksand font-semibold">
              Registrar tienda
            </h1>
            <p className="text-sm text-white font-quicksand px-10 text-center">
              Create tu cuenta como vendedor y comienza a vender tus productos.
            </p>
          </div>
        </div>

        {/* 🔹 Lado derecho (formulario) */}
        <div className="flex flex-col items-center justify-center h-auto sm:h-[90vh] w-full sm:w-[65%] px-5 sm:px-0 py-10 sm:py-0">
          {/* Logo */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <img className="h-16 sm:h-20" src={logo} alt="TukiShop" />
            <p className="font-fugaz text-2xl sm:text-3xl mb-4">TukiShop</p>
          </div>

          {/* Formulario */}
          <div className="flex flex-col w-full items-center space-y-5 mt-8 sm:mt-10 px-2 sm:px-30">
            <form
              className="flex flex-col items-center w-full space-y-5 sm:px-20"
              onSubmit={handleSubmit}
            >
              {/* Usuario y teléfono */}
              <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[93%]">
                <input
                  name="username"
                  className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[50%] font-quicksand"
                  placeholder="Nombre de usuario o tienda"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <input
                  name="phone_number"
                  className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[50%] font-quicksand"
                  placeholder="Teléfono"
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 8) value = value.slice(0, 8);
                    let formatted = value;
                    if (value.length > 4)
                      formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
                    setForm({ ...form, phone_number: formatted });
                  }}
                  maxLength={9}
                  required
                />
              </div>

              {/* Correo */}
              <input
                name="email"
                className="border-2 border-main text-main rounded-full px-4 py-3 w-full sm:w-[93%] font-quicksand"
                placeholder="Correo electrónico"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Contraseña y confirmación */}
              <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[93%]">
                {/* Contraseña */}
                <div className="relative w-full sm:w-[50%]">
                  <input
                    name="password"
                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand pr-10"
                    placeholder="Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-main"
                  >
                    {showPassword ? (
                      <IconEye size={20} />
                    ) : (
                      <IconEyeClosed size={20} />
                    )}
                  </button>
                </div>

                {/* Confirmar contraseña */}
                <div className="relative w-full sm:w-[50%]">
                  <input
                    name="password_confirmation"
                    className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand pr-10"
                    placeholder="Confirmar contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-3.5 text-main"
                  >
                    {showConfirmPassword ? (
                      <IconEye size={20} />
                    ) : (
                      <IconEyeClosed size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox de términos */}
              <div className="flex flex-row items-center sm:space-y-0 space-x-2 w-full sm:w-[93%] justify-center mt-2 text-center sm:text-left">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-main cursor-pointer"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 font-quicksand"
                >
                  Acepto los{" "}
                  <span
                    onClick={() => setShowTerms(true)}
                    className="text-main font-semibold cursor-pointer hover:underline"
                  >
                    Términos y Condiciones
                  </span>
                </label>
              </div>

              {/* Mensaje de error */}
              {(registerError || error) && (
                <div className="text-red-500 text-sm text-center">
                  {registerError || error}
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={!acceptedTerms || registering}
                className={`bg-main text-white rounded-full py-3 px-4 w-[60%] sm:w-[50%] font-quicksand transition ${!acceptedTerms || registering
                  ? "opacity-60 cursor-not-allowed"
                  : ""
                  }`}
              >
                {registering ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
          </div>
        </div>

        {/* Modal de términos */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl w-[90%] max-w-3xl h-[80vh] overflow-y-auto p-6 relative">
              <h2 className="text-2xl font-bold mb-4 text-main">
                Términos y Condiciones de Uso de TukiShop
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                Última actualización: 02/10/2025

                1. Objeto
                El presente documento establece los términos y condiciones de uso (en adelante, los “Términos y Condiciones”) que regulan el acceso, navegación y utilización de la plataforma digital TukiShop (en adelante, “Plataforma”), a través de la cual los usuarios podrán ofrecer, adquirir y gestionar productos y/o servicios por medio de internet.

                2. Definición de Usuarios
                A efectos de este documento, se entenderá por “Usuarios” tanto a los compradores como a los vendedores registrados en la Plataforma. Los Usuarios deberán aceptar íntegramente los presentes Términos y Condiciones para utilizar los servicios aquí ofrecidos.

                3. Registro y Responsabilidades del Usuario
                El acceso y uso de la Plataforma requiere registro previo de los Usuarios, quienes se obligan a proporcionar información veraz, actualizada y completa al momento del registro. Es responsabilidad exclusiva del Usuario custodiar sus credenciales de acceso, exonerando a la Plataforma de cualquier responsabilidad derivada del uso indebido o no autorizado de las mismas.

                4. Condiciones para Vendedores
                Cada vendedor será responsable de la veracidad, integridad y legalidad de la información publicada referente a sus productos y/o servicios, así como del cumplimiento de la normativa aplicable, incluyendo aquellos aspectos relacionados con las garantías y condiciones comerciales. Queda totalmente prohibida la oferta de productos ilegales, prohibidos o que vulneren derechos de terceros.

                5. Condiciones para Compradores
                Los compradores se obligan a emplear los servicios de la Plataforma de conformidad con la legalidad vigente y las presentes condiciones, comprometiéndose a proporcionar información verídica en las transacciones y a completar los pagos conforme a las condiciones pactadas en cada caso.

                6. Formas de Pago y Condiciones Financieras
                La Plataforma pone a disposición de los Usuarios diferentes métodos de pago, debiendo consultarse las condiciones particulares de cada uno. Los precios publicados incluirán, en su caso, los impuestos aplicables y gastos adicionales, que serán informados antes de la formalización de la transacción. El cobro de comisiones o tarifas por el uso de la Plataforma será comunicado de forma previa, según corresponda.

                7. Entrega de Productos, Envíos y Devoluciones
                Los plazos y condiciones de entrega serán determinados por cada vendedor y estarán debidamente informados en la ficha de producto. Las políticas de devolución, garantía y reembolso deberán ser informadas expresamente y cumplir, como mínimo, con la legislación vigente en materia de protección al consumidor.

                8. Propiedad Intelectual e Industrial
                Todos los derechos sobre los contenidos, software, marcas, logos, imágenes y demás elementos de la Plataforma corresponden a la titular de la misma o a los legítimos titulares de los derechos. Queda prohibida la reproducción, distribución, modificación o uso no autorizado de cualquier elemento integrante de la Plataforma.

                9. Responsabilidad y Exoneración de Garantía
                La Plataforma actúa exclusivamente como intermediaria entre vendedores y compradores, y no asume ninguna responsabilidad por los productos o servicios ofertados y/o entregados por terceros, salvo en los supuestos expresamente previstos por la normativa aplicable. La Plataforma no será responsable de daños indirectos, lucro cesante, pérdida de datos, o cualquier daño resultante del uso o imposibilidad de uso de la misma.

                10. Restricción, Suspensión y Cancelación de Cuentas
                La Plataforma se reserva el derecho de restringir, suspender o cancelar el acceso a Usuarios que incumplan con los presentes Términos y Condiciones, lleven a cabo actividades ilícitas, fraudulentas, o que puedan afectar la seguridad, integridad y correcto funcionamiento de la Plataforma.

                11. Protección de Datos Personales
                El tratamiento de los datos personales de los Usuarios se realizará conforme a la Política de Privacidad de la Plataforma y a la normativa vigente en la materia, asegurando su confidencialidad e integridad.

                12. Modificaciones de los Términos y Condiciones
                La titular de la Plataforma podrá modificar en cualquier momento los presentes Términos y Condiciones, notificando a los Usuarios mediante la publicación de la versión actualizada en la Plataforma. El uso continuo supondrá la aceptación de los mismos.

                13. Legislación Aplicable y Jurisdicción
                Los presentes Términos y Condiciones se regirán e interpretarán conforme a las leyes de Costa Rica, y ante cualquier controversia, las partes se someten expresamente a los juzgados y tribunales competentes de dicha jurisdicción.

                14. Contacto
                Para cualquier duda, consulta o reclamación, el Usuario podrá contactar a través de soporte@tukishopcr.com.

                © 2025 TukiShop. Todos los derechos reservados.
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowTerms(false)}
                  className="bg-main text-white px-6 py-2 rounded-full hover:bg-contrast-main transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
