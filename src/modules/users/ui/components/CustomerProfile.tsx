import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/context/AuthContext";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import axios from "axios";
import { uploadImage } from "../../infrastructure/imageService";
import { IconEdit } from "@tabler/icons-react";

interface CustomerProfileProps {
  alert: any;
  setAlert: React.Dispatch<React.SetStateAction<any>>;
}

export default function CustomerProfile({ setAlert }: CustomerProfileProps) {
  const { user, refreshUser, token } = useAuth();
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 Campos de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 Direcciones del usuario
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "Costa Rica",
    phone_number: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error("❌ Error al obtener direcciones:", error);
      }
    };

    if (user) fetchAddresses();
  }, [user, token]);

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user) {
        const body: Record<string, any> = {};

        // 🖼️ Imagen de perfil
        if (newProfileFile) {
          const imageUrl = await uploadImage(newProfileFile);
          body.image = imageUrl;
        }

        // 📩 Actualizar foto si aplica
        if (Object.keys(body).length > 0) {
          await axios.patch(`/users/${user.id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await refreshUser?.();
        }

        // 🔐 Cambiar contraseña
        if (cambiarPassword) {
          if (!currentPassword || !newPassword || !confirmPassword) {
            setAlert({
              show: true,
              title: "Campos incompletos",
              message: "Debes llenar todos los campos de contraseña.",
              type: "warning",
            });
            setSaving(false);
            return;
          }

          // Verificar que las contraseñas coincidan
          if (newPassword !== confirmPassword) {
            setAlert({
              show: true,
              title: "Error de confirmación",
              message: "Las contraseñas no coinciden.",
              type: "error",
            });
            setSaving(false);
            return;
          }

          try {
            // Enviar solicitud para cambiar la contraseña
            await axios.put("/change-password", {
              current_password: currentPassword,
              new_password: newPassword,
              new_password_confirmation: confirmPassword,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err: unknown) {
            // Verificar si `err` es un error de Axios con la propiedad `response`
            if (axios.isAxiosError(err) && err.response) {
              console.error("Error al actualizar la contraseña:", err.response);
              setAlert({
                show: true,
                title: "Error al guardar",
                message: err.response?.data?.error || "Error desconocido.",
                type: "error",
              });
            } else {
              console.error("Error inesperado:", err);
              setAlert({
                show: true,
                title: "Error al guardar",
                message: "Ocurrió un problema desconocido.",
                type: "error",
              });
            }
          }
        }

        setAlert({
          show: true,
          title: "Cambios guardados",
          message: cambiarPassword
            ? "Tu contraseña y perfil se actualizaron correctamente."
            : "Tu foto de perfil se actualizó correctamente.",
          type: "success",
        });

        // Reset campos
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setCambiarPassword(false);
        setProfilePreview(null);
        setNewProfileFile(null);
      }
    } catch (err: any) {
      setAlert({
        show: true,
        title: "Error al guardar",
        message:
          err.response?.data?.error ||
          "Ocurrió un problema al actualizar el perfil.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };


  const handleAddAddress = async () => {
    try {
      // 📨 1️⃣ Crear la nueva dirección en el backend
      await axios.post("/addresses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔁 2️⃣ Volver a cargar las direcciones actualizadas
      const res = await axios.get("/user/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data.addresses || []);

      // ✅ 3️⃣ Alerta de éxito
      setAlert({
        show: true,
        title: "Dirección agregada",
        message: "Tu nueva dirección se guardó correctamente.",
        type: "success",
      });

      // 🧹 4️⃣ Reset del formulario
      setForm({
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "Costa Rica",
        phone_number: "",
      });
      setAddingAddress(false);
    } catch (error) {
      console.error("❌ Error al agregar dirección:", error);
      setAlert({
        show: true,
        title: "Error al agregar",
        message: "No se pudo agregar la dirección.",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setProfilePreview(null);
    setNewProfileFile(null);
    setCambiarPassword(false);
    setAddingAddress(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-10 font-quicksand px-4 sm:px-10">
      {/* Imagen de perfil */}
      <div className="relative flex justify-center">
        {profilePreview || user?.image ? (
          <img
            src={profilePreview || user?.image}
            alt="profile_image"
            className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow"
          />
        ) : (
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-contrast-main to-contrast-secondary flex items-center justify-center border-4 border-white shadow">
            <p className="uppercase text-white font-bold text-5xl relative top-[-2px]">
              {user?.username?.[0] || "?"}
            </p>
          </div>
        )}

        <label className="absolute bottom-2 right-[calc(50%-4.5rem)] sm:right-[calc(50%-5rem)] bg-contrast-secondary/80 hover:bg-main/80 text-white p-2 rounded-full cursor-pointer transition-all duration-300">
          <IconEdit size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileFileChange}
          />
        </label>
      </div>

      {/* 🧾 Formulario */}
      <div className="w-full sm:w-[70%]">
        <form className="flex flex-col gap-5 pt-6 sm:pt-10">
          {/* Nombre y correo */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <input
              type="text"
              placeholder={user?.first_name || "Nombre"}
              className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder={user?.email || "Correo electrónico"}
              className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
              disabled
            />
          </div>

          {/* Username */}
          <input
            type="text"
            placeholder={user?.username || "Nombre de usuario"}
            className="bg-main-dark/20 rounded-xl px-3 py-2 w-full sm:w-[50%] text-sm sm:text-base"
          />

          {/* 🏠 Direcciones */}
          <div className="w-full sm:w-[70%] mt-6">
            <h2 className="text-lg font-semibold mb-3 text-main-dark">
              Direcciones
            </h2>

            {addresses.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <li
                    key={addr.id}
                    className="bg-main-dark/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {addr.street}, {addr.city}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr.state && `${addr.state}, `}
                        {addr.country} {addr.zip_code && `• ${addr.zip_code}`}
                      </p>
                      {addr.phone_number && (
                        <p className="text-xs text-gray-600">
                          Tel: {addr.phone_number}
                        </p>
                      )}
                    </div>
                    {addr.is_default && (
                      <span className="text-xs bg-main text-white px-2 py-1 rounded-full mt-2 sm:mt-0">
                        Principal
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-3">
                No tienes direcciones registradas.
              </p>
            )}

            {!addingAddress ? (
              <ButtonComponent
                text="Agregar nueva dirección"
                onClick={() => setAddingAddress(true)}
                style="bg-main text-white w-full sm:w-auto mt-4 px-6 py-2 rounded-full hover:scale-105 transition-all"
              />
            ) : (
              <div className="mt-5 bg-main-dark/10 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-sm text-main-dark">
                  Nueva dirección
                </h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Calle o descripción (Ej: Casa 25)"
                    value={form.street}
                    onChange={(e) =>
                      setForm({ ...form, street: e.target.value })
                    }
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                    />
                    <input
                      type="text"
                      placeholder="Provincia / Estado"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Código postal"
                      value={form.zip_code}
                      onChange={(e) =>
                        setForm({ ...form, zip_code: e.target.value })
                      }
                      className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                    />
                    <input
                      type="text"
                      placeholder="País"
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                      className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Teléfono de contacto"
                    value={form.phone_number}
                    onChange={(e) =>
                      setForm({ ...form, phone_number: e.target.value })
                    }
                    className="bg-white rounded-xl px-3 py-2 w-full text-sm border border-gray-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <ButtonComponent
                    text="Cancelar"
                    onClick={() => setAddingAddress(false)}
                    style="bg-gray-400 text-white w-full sm:w-[48%] py-2 rounded-full hover:opacity-90"
                  />
                  <ButtonComponent
                    text="Guardar dirección"
                    onClick={handleAddAddress}
                    style="bg-contrast-secondary text-white w-full sm:w-[48%] py-2 rounded-full hover:scale-105 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cambiar contraseña */}
          <label className="flex items-center gap-2 pt-5 text-sm sm:text-base">
            Cambiar contraseña
            <input
              type="checkbox"
              checked={cambiarPassword}
              onChange={() => setCambiarPassword(!cambiarPassword)}
            />
          </label>

          {cambiarPassword && (
            <div className="flex flex-col gap-5 mt-2">
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-main-dark/20 rounded-xl px-3 py-2 w-full sm:w-[50%] text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                />
              </div>
            </div>
          )}
        </form>

        {/* 🧩 Botones */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-10 w-full">
          <ButtonComponent
            text="Cancelar"
            onClick={handleCancel}
            style="w-full sm:w-[48%] p-3 rounded-full text-white bg-main cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
          />
          <ButtonComponent
            text={saving ? "Guardando..." : "Guardar cambios"}
            onClick={handleSave}
            style="w-full sm:w-[48%] p-3 rounded-full text-white bg-contrast-secondary cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}
