// src/modules/admin/infrastructure/useBanner.ts
import { useState } from "react";
import axios from "axios";
import { uploadImage } from "../../users/infrastructure/imageService";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

interface Banner {
  id?: number;
  title?: string;
  subtitle?: string;
  character?: string | File;
  image: string | File;
  link?: string;
  btn_text?: string;
  btn_color?: "MORADO" | "AMARILLO" | "NARANJA" | "GRADIENTE";
  type: "LARGE" | "SHORT" | "SLIDER";
  orientation?: "LEFT" | "RIGTH";
  position?: number;
  is_active?: boolean;
}

export function useBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener todos los banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/banners");
      setBanners(data);
    } catch (err) {
      console.error("Error al obtener los banners", err);
      setError("Error al obtener los banners");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear o actualizar banner
  const saveBanner = async (banner: Banner) => {
    try {
      setLoading(true);
      setError(null);

      let uploadedImage = banner.image;
      let uploadedCharacter = banner.character;

      // 📤 Subir imagen de fondo
      if (banner.image && banner.image instanceof File) {
        uploadedImage = await uploadImage(banner.image);
      }

      // 📤 Subir personaje si existe
      if (banner.character && banner.character instanceof File) {
        uploadedCharacter = await uploadImage(banner.character);
      }

      const payload = {
        ...banner,
        image: uploadedImage,
        character: uploadedCharacter,
      };

      // ✅ Crear o actualizar según corresponda
      if (banner.id) {
        const { data } = await axios.put(`/banners/${banner.id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        return data;
      } else {
        const { data } = await axios.post(`/banners`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        return data;
      }
    } catch (err: any) {
      console.error("Error al guardar el banner:", err);
      setError("Error al guardar el banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar banner
  const deleteBanner = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/banners/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error al eliminar banner:", err);
      setError("Error al eliminar el banner");
    } finally {
      setLoading(false);
    }
  };

  return {
    banners,
    loading,
    error,
    fetchBanners,
    saveBanner,
    deleteBanner,
  };
}
