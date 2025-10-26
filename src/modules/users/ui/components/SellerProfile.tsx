import { useState, useEffect } from "react";
import axios from "axios";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import {
  IconEdit,
  IconPhone,
  IconSquareRoundedPlus,
  IconX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX as IconTwitter,
  IconLink,
  IconBrandWhatsapp,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { uploadImage } from "../../infrastructure/imageService";
import { updateStore } from "../../../seller/infrastructure/storeService";
import { useAuth } from "../../../../hooks/context/AuthContext";

interface Store {
  id: number;
  name: string;
  description?: string | null;
  banner?: string | null;
  image?: string | null;
  support_phone?: string | null;
  support_email?: string | null;
  registered_address?: string | null;
  is_verified?: boolean | string | null;

  // 🔹 Agrega esto:
  storeSocials?: {
    id: number;
    platform: "instagram" | "facebook" | "x" | "link" | string;
    url: string;
  }[];
}

interface SocialLink {
  type: "instagram" | "x" | "facebook" | "link";
  text: string;
}

const iconMap = {
  instagram: <IconBrandInstagram />,
  x: <IconTwitter />,
  facebook: <IconBrandFacebook />,
  link: <IconLink />,
};

interface SellerProfileProps {
  alert: any;
  setAlert: React.Dispatch<React.SetStateAction<{
    show: boolean;
    title: string;
    message: string;
    type: "warning" | "info" | "success" | "error";
  }>>;
}

export default function SellerProfile({ setAlert }: SellerProfileProps) {
  const { user, refreshUser, token } = useAuth();
  const [editableStore, setEditableStore] = useState<Store | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState<SocialLink["type"]>("instagram");
  const [newText, setNewText] = useState("");
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.store) {
      const storeData = {
        ...user.store,
        is_verified:
          user.store.is_verified === true || user.store.is_verified === "true"
            ? true
            : false,
      };
      setEditableStore(storeData);
    }
  }, [user]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!user?.store?.id) return;

      try {
        // 🔹 Obtener tienda completa con relaciones
        const { data } = await axios.get(`/stores/${user.store.id}`);

        // 🔹 Actualizar estado editableStore (con imagen/banner actualizados)
        setEditableStore({
          ...data,
          is_verified: data.is_verified === true || data.is_verified === "true",
        });

        // 🔹 Cargar redes sociales
        const socials =
          data.storeSocials?.map((s: any) => ({
            type: s.platform,
            text: s.url,
          })) ||
          data.store_socials?.map((s: any) => ({
            type: s.platform,
            text: s.url,
          })) ||
          [];

        setSocialLinks(socials);
      } catch (err) {
        console.error("Error cargando detalles de la tienda:", err);
      }
    };

    fetchStoreDetails();
  }, [user?.store?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableStore((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewLogoFile(file);
    const previewURL = URL.createObjectURL(file);
    setEditableStore((prev) => (prev ? { ...prev, image: previewURL } : prev));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewBannerFile(file);
    const previewURL = URL.createObjectURL(file);
    setEditableStore((prev) => (prev ? { ...prev, banner: previewURL } : prev));
  };

  const handleCancel = () => {
    if (user?.store) setEditableStore({ ...user.store });
    setNewBannerFile(null);
    setNewLogoFile(null);
    setSocialLinks([]);
    setAdding(false);
    setCambiarPassword(false);
  };

  const addSocialLink = () => {
    if (newText.trim() === "") return;
    setSocialLinks((prev) => [...prev, { type: newType, text: newText }]);
    setNewText("");
    setAdding(false);
  };

  const handleSave = async () => {
    if (!editableStore) return;
    setSaving(true);

    try {
      const updatedFields: Record<string, any> = {
        name: editableStore.name ?? "",
        description: editableStore.description ?? "",
        registered_address: editableStore.registered_address ?? "",
        support_phone: editableStore.support_phone ?? "",
        support_email: editableStore.support_email ?? "",
        social_links: socialLinks,
      };

      if (newLogoFile) {
        const logoUrl = await uploadImage(newLogoFile);
        updatedFields.image = logoUrl;
      }

      if (newBannerFile) {
        const bannerUrl = await uploadImage(newBannerFile);
        updatedFields.banner = bannerUrl;
      }

      await updateStore(editableStore.id, updatedFields);
      await refreshUser?.();

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

        await axios.put(
          "/change-password",
          {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setAlert({
        show: true,
        title: "Cambios guardados",
        message: cambiarPassword
          ? "Tu contraseña y perfil de tienda se actualizaron correctamente."
          : "La tienda se actualizó correctamente.",
        type: "success",
      });

      // Reset del estado
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCambiarPassword(false);
      setNewLogoFile(null);
      setNewBannerFile(null);
    } catch (err: any) {
      setAlert({
        show: true,
        title: "Error al guardar",
        message:
          err.response?.data?.error ||
          "Ocurrió un problema al actualizar los datos.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!editableStore) return null;

  return (
    <div className="flex flex-col justify-center gap-4 mt-10 font-quicksand">
      {/* 🔸 Estado de verificación */}
      {editableStore.is_verified === false && (
        <div className="flex flex-col gap-6 justify-center items-center bg-white rounded-2xl py-10 px-4 sm:px-12 mx-4 sm:ml-10 shadow-lg border border-main/20 text-center">
          <div className="flex items-center justify-center w-14 h-14 bg-contrast-secondary/20 rounded-full">
            <IconExclamationCircle
              size={30}
              className="text-contrast-secondary"
            />
          </div>

          <p className="text-xl font-semibold text-main">
            Tu tienda está en verificación
          </p>
          <p className="text-main-dark/70 max-w-md">
            El equipo de TukiShop se pondrá en contacto contigo para verificar
            tu tienda. Si tienes dudas, contacta con soporte.
          </p>
          <a
            href="https://wa.me/50687355629"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-contrast-secondary text-white rounded-full hover:scale-105 transition-all duration-300 shadow-sm"
          >
            <IconBrandWhatsapp size={20} />
            Contactar soporte
          </a>
        </div>
      )}

      {/* 🔹 Contenido editable (solo tiendas verificadas) */}
      {editableStore.is_verified === true && (
        <>
          {/* 🖼️ Logo / Banner */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 px-4 sm:px-10"
          >
            {/* Logo */}
            <figure className="flex flex-col gap-4 sm:gap-10 w-full sm:w-1/3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm sm:text-base font-semibold">
                  Logo de tienda
                </p>
                <label className="bg-contrast-secondary/80 hover:bg-main/80 text-white p-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <IconEdit size={20} />
                </label>
              </div>
              <img
                src={
                  editableStore.image ||
                  "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761412207/imagenNoSubida_dymbb7.png"
                }
                alt="Logo"
                className="w-[60%] sm:w-2/3 max-w-[12rem] h-auto rounded-xl object-cover shadow-sm"
              />
            </figure>

            {/* Banner */}
            <figure className="flex flex-col gap-4 sm:gap-10 w-full sm:w-2/3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <p className="text-sm sm:text-base font-semibold">
                  Banner de la tienda
                </p>
                <label className="bg-contrast-secondary/80 hover:bg-main/80 text-white p-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  <IconEdit size={20} />
                </label>
              </div>
              <img
                src={
                  editableStore.banner ||
                  "https://res.cloudinary.com/dpbghs8ep/image/upload/v1761410400/BannerNoSubido_avlp5v.png"
                }
                alt="Banner"
                className="rounded-xl object-cover w-full sm:w-auto max-h-[12rem] sm:max-h-[10rem] shadow-sm"
              />
            </figure>
          </form>

          {/* 🧾 Formulario principal */}
          <div className="w-full px-4 sm:px-10">
            <form className="flex flex-col gap-6 sm:gap-8 pt-8 sm:pt-10">
              {/* Campos principales */}
              <section className="flex flex-col gap-6 sm:gap-10">
                {/* Nombre / Correo */}
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                  <label className="flex flex-col w-full">
                    Nombre de la tienda
                    <textarea
                      name="name"
                      value={editableStore.name || ""}
                      onChange={handleChange}
                      rows={2}
                      className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                    />
                  </label>
                  <label className="flex flex-col w-full">
                    Correo electrónico
                    <input
                      type="text"
                      placeholder={user?.email || "Correo de la tienda"}
                      className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                      disabled
                    />
                  </label>
                </div>

                {/* Teléfono / Email */}
                <section className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                  <div className="w-full">
                    Número telefónico
                    <label className="bg-main-dark/20 rounded-xl px-3 flex items-center gap-2 w-full">
                      <IconPhone className="text-contrast-secondary" />
                      <input
                        name="support_phone"
                        type="text"
                        value={editableStore.support_phone || ""}
                        onChange={handleChange}
                        placeholder="Número telefónico"
                        className="w-full py-2 focus:outline-none text-sm sm:text-base"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col w-full">
                    Correo de la tienda
                    <input
                      type="email"
                      name="support_email"
                      value={editableStore.support_email || ""}
                      onChange={handleChange}
                      className="bg-main-dark/20 rounded-xl px-3 py-2 w-full text-sm sm:text-base"
                    />
                  </label>
                </section>

                {/* Redes sociales */}
                <section>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <h2>Links / Redes sociales</h2>
                      {!adding ? (
                        <button type="button" onClick={() => setAdding(true)}>
                          <IconSquareRoundedPlus className="text-contrast-secondary cursor-pointer" />
                        </button>
                      ) : (
                        <button type="button" onClick={() => setAdding(false)}>
                          <IconX className="text-contrast-secondary size-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {socialLinks.map((link, index) => (
                        <ButtonComponent
                          key={index}
                          text={link.text}
                          icon={iconMap[link.type]}
                          style="text-main-dark flex gap-2 bg-main-dark/20 py-3 px-2 rounded-xl font-semibold"
                          iconStyle="text-contrast-secondary"
                        />
                      ))}

                      {adding && (
                        <div className="flex gap-2 items-center bg-main-dark/10 py-3 px-2 rounded-xl">
                          <select
                            value={newType}
                            onChange={(e) =>
                              setNewType(e.target.value as SocialLink["type"])
                            }
                            className="bg-transparent outline-none"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="x">X</option>
                            <option value="facebook">Facebook</option>
                            <option value="link">Link</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Usuario o link"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="bg-transparent outline-none flex-1"
                          />
                          <button
                            type="button"
                            onClick={addSocialLink}
                            className="text-contrast-secondary font-semibold"
                          >
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Descripción / Dirección */}
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
                  <label className="flex flex-col w-full">
                    Descripción de la tienda
                    <textarea
                      name="description"
                      value={editableStore.description || ""}
                      onChange={handleChange}
                      rows={4}
                      className="bg-main-dark/20 rounded-xl px-3 py-2 text-sm sm:text-base"
                    />
                  </label>
                  <label className="flex flex-col w-full">
                    Dirección de la tienda
                    <textarea
                      name="registered_address"
                      value={editableStore.registered_address || ""}
                      onChange={handleChange}
                      rows={4}
                      className="bg-main-dark/20 rounded-xl px-3 py-2 text-sm sm:text-base"
                    />
                  </label>
                </div>

                {/* ✅ Cambiar contraseña */}
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
              </section>
            </form>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 w-full">
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
        </>
      )}
    </div>
  );
}
