import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconEye, IconEyeClosed } from "@tabler/icons-react"; // 👁️ Importados aquí
import logo from "../../../../img/TukiLogo.png";
import { useAuth } from "../../../../hooks/context/AuthContext";

export default function LoginForm() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Nuevo estado
  const navigate = useNavigate();
const [error, setError] = useState(""); // 👈 agrega esto



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpia error previo

    const emailLower = email.toLowerCase();

    try {
      const success = await login(emailLower, password);

      if (!success) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);

      if (error.response?.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("No se pudo conectar con el servidor. Intenta nuevamente.");
      }
    }
  };



  return (
    <div className="flex flex-col items-center w-full justify-center">
      <img className="h-20" src={logo} alt="" />
      <p className="font-fugaz text-2xl">TukiShop</p>
      <div className="flex flex-col w-full items-center space-y-5 mt-10">
        <form
          className="flex flex-col items-center w-full space-y-5"
          onSubmit={handleSubmit}
        >
          <input
            className="border-2 border-contrast-secondary text-contrast-secondary rounded-full px-4 py-3 w-full sm:w-[65%] font-quicksand"
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔒 Campo de contraseña con ícono sin alterar diseño */}
          <div className="relative w-full sm:w-[65%]">
            <input
              className="border-2 border-contrast-secondary text-contrast-secondary rounded-full px-4 py-3 w-full font-quicksand pr-10"
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-contrast-secondary"
            >
              {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
            </button>
          </div>

          <button
            className="bg-contrast-secondary text-white rounded-full py-3 px-4 w-full sm:w-[30%] font-quicksand cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {error && <div className="text-red-500">{error}</div>}

        <Link to="/forgotPassword">
          <span className="text-main font-quicksand">
            ¿Olvidaste tu contraseña?
          </span>
        </Link>
      </div>
    </div>
  );
}
