import { IconX } from "@tabler/icons-react";
import BannerComponent from "../../../../components/data-display/BannerComponent";
import ButtonComponent from "../../../../components/ui/ButtonComponent";
import { useBanner } from "../../infrastructure/useBanner";
import { useState } from "react";
import { uploadImage } from "../../../users/infrastructure/imageService";

interface BannerModalProps {
  newBanner: any;
  setNewBanner: (value: any) => void;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function BannerModal({
  newBanner,
  setNewBanner,
  onClose,
  onSaveSuccess,
}: BannerModalProps) {
  const { saveBanner, loading } = useBanner();
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBanner((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewBanner((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "character"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setNewBanner((prev: any) => ({
        ...prev,
        [field]: uploadedUrl,
      }));
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      alert("Error al subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveBanner(newBanner);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Error al guardar banner:", err);
      alert("No se pudo guardar el banner.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn font-quicksand px-3 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-[80rem] max-w-[95vw] shadow-xl relative animate-scaleIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-main-dark text-center">
          Nuevo Banner
        </h2>

        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={onClose}
        >
          <IconX size={24} />
        </button>

        {/* 🔹 Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 🧾 Columna izquierda: formulario */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={newBanner.title ?? ""}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main truncate"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Subtítulo
              </label>
              <input
                type="text"
                name="subtitle"
                value={newBanner.subtitle ?? ""}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Imagen de fondo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="w-full border rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-main-dark file:text-white file:cursor-pointer hover:file:bg-main transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Imagen del personaje
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "character")}
                className="w-full border rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-main-dark file:text-white file:cursor-pointer hover:file:bg-main transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Tipo</label>
                <select
                  name="type"
                  value={newBanner.type}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
                >
                  <option value="LARGE">LARGE</option>
                  <option value="SHORT">SHORT</option>
                  <option value="SLIDER">SLIDER</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Orientación
                </label>
                <select
                  name="orientation"
                  value={newBanner.orientation ?? "LEFT"}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
                >
                  <option value="LEFT">Izquierda</option>
                  <option value="RIGTH">Derecha</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Link</label>
                <input
                  type="text"
                  name="link"
                  value={newBanner.link ?? ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Texto del botón
                </label>
                <input
                  type="text"
                  name="btn_text"
                  value={newBanner.btn_text ?? ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Color del botón
              </label>
              <select
                name="btn_color"
                value={newBanner.btn_color}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-main"
              >
                <option value="MORADO">Morado</option>
                <option value="AMARILLO">Amarillo</option>
                <option value="NARANJA">Naranja</option>
                <option value="GRADIENTE">Gradiente</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="is_active"
                type="checkbox"
                name="is_active"
                checked={!!newBanner.is_active}
                onChange={handleCheckboxChange}
                className="h-4 w-4 accent-main"
              />
              <label htmlFor="is_active" className="text-sm">
                Activo (visible en el sitio)
              </label>
            </div>
          </form>

          {/* 🖼️ Columna derecha: preview */}
          <div className="flex flex-col items-center justify-start pt-2 sm:pt-4">
            <h3 className="font-semibold text-base sm:text-lg mb-3 text-main-dark">
              Previsualización
            </h3>

            {newBanner.image ? (
              <div className="scale-95 sm:scale-[0.9] border border-gray-300 p-2 sm:p-3 rounded-2xl shadow-sm bg-gray-50 w-full sm:w-auto">
                <BannerComponent
                  id={newBanner.id}
                  type={newBanner.type}
                  orientation={newBanner.orientation}
                  title={newBanner.title}
                  subtitle={newBanner.subtitle}
                  image={
                    typeof newBanner.image === "string"
                      ? newBanner.image
                      : URL.createObjectURL(newBanner.image)
                  }
                  character={
                    newBanner.character
                      ? typeof newBanner.character === "string"
                        ? newBanner.character
                        : URL.createObjectURL(newBanner.character)
                      : undefined
                  }
                  btn_text={newBanner.btn_text}
                  btn_color={newBanner.btn_color}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-4 text-center px-2">
                Sube una imagen para ver la previsualización
              </p>
            )}
          </div>
        </div>

        {/* 🧭 Botones inferiores */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <ButtonComponent
            text="Cancelar"
            style="bg-gray-300 text-black rounded-full px-4 py-2 hover:bg-gray-400 transition-all duration-300 w-full sm:w-auto"
            onClick={onClose}
          />
          <ButtonComponent
            text={loading || uploading ? 'Guardando...' : 'Guardar'}
            style={`${
              loading || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-main-dark hover:bg-main'
            } text-white rounded-full px-4 py-2 transition-all duration-300 w-full sm:w-auto`}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
