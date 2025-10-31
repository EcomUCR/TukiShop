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

interface BannerImage {
  id?: number;
  link: string | File;
  type: "CHARACTER" | "BACKGROUND";
  alt_text?: string;
}

export function useBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ======================================================
  // 🧩 BANNERS PRINCIPALES (ya existente)
  // ======================================================

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

  // 🔹 Crear o actualizar banner principal
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

  // 🔹 Eliminar banner principal
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

  // ======================================================
  // 🖼️ BANNER IMAGES (CHARACTER / BACKGROUND)
  // ======================================================

  // 🔹 Obtener imágenes de banner
  const fetchBannerImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/banner-images");
      setBannerImages(data);
    } catch (err) {
      console.error("Error al obtener las imágenes de banner", err);
      setError("Error al obtener las imágenes de banner");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nueva imagen de banner (CHARACTER / BACKGROUND)
  const saveBannerImage = async (imageData: BannerImage) => {
    try {
      setLoading(true);
      setError(null);

      let uploadedLink = imageData.link;

      // 📤 Si el link es un archivo, súbelo
      if (imageData.link && imageData.link instanceof File) {
        uploadedLink = await uploadImage(imageData.link);
      }

      const payload = {
        link: uploadedLink,
        type: imageData.type,
        alt_text: imageData.alt_text ?? "",
      };

      const { data } = await axios.post(`/banner-images`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      setBannerImages((prev) => [...prev, data.banner]);
      return data.banner;
    } catch (err) {
      console.error("Error al guardar la imagen de banner", err);
      setError("Error al guardar la imagen de banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar imagen de banner
  const deleteBannerImage = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/banner-images/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setBannerImages((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error al eliminar imagen de banner", err);
      setError("Error al eliminar imagen de banner");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 🔁 Retorno
  // ======================================================

  return {
    // banners existentes
    banners,
    loading,
    error,
    fetchBanners,
    saveBanner,
    deleteBanner,

    // nuevas imágenes de banner
    bannerImages,
    fetchBannerImages,
    saveBannerImage,
    deleteBannerImage,
  };
}
