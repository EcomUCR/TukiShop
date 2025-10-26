import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import logo from "../../../../img/TukiLogo.png";
import useRegister from "../../infrastructure/useRegister";

type Props = {
  onRegisterSuccess?: () => void;
};

export default function RegisterForm({ onRegisterSuccess }: Props) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // 👁️ Estados para mostrar u ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading, error } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!acceptedTerms) {
      setLocalError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    if (form.password !== form.password_confirmation) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      username: form.username.toLowerCase(),
      email: form.email.toLowerCase(),
      password: form.password,
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
      role: "CUSTOMER" as const,
    };

    try {
      await register(payload);
      onRegisterSuccess?.();
    } catch { }
  };

  return (
    <div className="flex flex-col items-center w-full justify-center">
      <img className="h-20" src={logo} alt="TukiShop" />
      <p className="font-fugaz text-2xl">TukiShop</p>

      <div className="flex flex-col w-full items-center space-y-5 mt-10">
        <form
          className="flex flex-col items-center w-full space-y-5"
          onSubmit={handleSubmit}
        >
          {/* Nombre y apellido */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[80%]">
            <input
              className="border-2 border-main text-main rounded-full px-4 py-3 sm:w-[45%] font-quicksand"
              placeholder="Nombre"
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              className="border-2 border-main text-main rounded-full px-4 py-3 sm:w-[45%] font-quicksand"
              placeholder="Apellido"
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email y username */}
          <div className="flex flex-col space-y-5 w-full sm:w-[75%]">
            <input
              className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand"
              placeholder="Correo electrónico"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand"
              placeholder="Nombre de usuario"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* Contraseña y confirmación */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-[80%]">
            {/* Contraseña */}
            <div className="relative w-full sm:w-[45%]">
              <input
                className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand pr-10"
                placeholder="Contraseña"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-main"
              >
                {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
              </button>
            </div>

            {/* Confirmar contraseña */}
            <div className="relative w-full sm:w-[45%]">
              <input
                className="border-2 border-main text-main rounded-full px-4 py-3 w-full font-quicksand pr-10"
                placeholder="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-main"
              >
                {showConfirmPassword ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeClosed size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Checkbox y botón */}
          <div className="flex flex-col items-center w-full">
            <label htmlFor="terms" className="flex items-center gap-2 mb-3">
              <input
                id="terms"
                className="mt-0.5 cursor-pointer accent-main"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <button
                type="button"
                className="cursor-pointer text-sm font-quicksand"
                onClick={() => setShowTerms(true)}
              >
                Acepto los{" "}
                <span className="font-semibold underline text-main">
                  términos y condiciones
                </span>
              </button>
            </label>

            <button
              className={`bg-main text-white rounded-full py-3 px-4 w-[50%] font-quicksand cursor-pointer transition ${!acceptedTerms || loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              type="submit"
              disabled={!acceptedTerms || loading}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </div>
        </form>

        {/* Errores */}
        {localError && <div className="text-red-500">{localError}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>

      {/* Modal de Términos */}
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
    </div>
  );
}
