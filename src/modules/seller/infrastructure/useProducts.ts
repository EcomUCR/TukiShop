import { useState } from "react";
import axios from "axios";
import { getStoreByUser } from "./storeService";
import { useAuth } from "../../../hooks/context/AuthContext";

// ⚠️ Usamos el proxy de Vite en dev: en producción se debe usar VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// src/infrastructure/useProducts.ts
export type Category = {
  id: number;
  name: string;
};

export type Product = {
  store_id?: number;
  id?: number;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED";
  categories: number[];
  rating?: number;
  image: File | string | null;
  image_1_url?: string;
  image_2_url?: string;
  image_3_url?: string;
  is_featured: boolean;
  store?: {
    id: number;
    name: string;
  };
};

export function useProducts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const normalizeProduct = (p: any): Product => ({
    ...p,
    store: p.store || (p.store_name ? { id: p.store_id, name: p.store_name } : undefined),
  });

  // Obtener categorías
  const getCategories = async (): Promise<Category[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data;
    } catch (e: any) {
      setError("No se pudieron cargar las categorías");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getFeaturedProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products/featured`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos destacados");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Subir imagen y obtener URL de cloudinary
  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await axios.post(`${BASE_URL}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url as string;
  };
  // 🔍 Buscar productos dentro de una tienda específica
  const searchProductsByStore = async (
    store_id: number,
    query: string
  ): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/store/${store_id}/search`, {
        params: { q: query },
      });
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron buscar los productos en la tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (product: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const store = await getStoreByUser(user?.id ?? 0);
      if (!store?.id) throw new Error("No se encontró la tienda asociada al usuario");

      const store_id = store.id;

      // Subir imágenes (solo las que existan)
      const uploadIfFile = async (img: any) =>
        img instanceof File ? await uploadImage(img) : img || null;

      const image1Url = await uploadIfFile(product.image);
      const image2Url = await uploadIfFile(product.image_2);
      const image3Url = await uploadIfFile(product.image_3);

      const payload = {
        store_id,
        sku: `SKU-${Date.now()}`,
        name: product.name,
        description: product.description || "",
        price: product.price,
        discount_price: product.discount_price ?? 0,
        stock: product.stock,
        status: product.status || "ACTIVE", // 🔹 conserva el valor real
        is_featured: product.is_featured,
        image_1_url: image1Url,
        image_2_url: image2Url,
        image_3_url: image3Url,
        category_ids: product.categories,
      };

      await axios.post(`${BASE_URL}/products`, payload);
      setSuccess("¡Producto creado con éxito!");
    } catch (e: any) {
      setError("Error al crear el producto: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // 👤 Obtener todos los productos de la tienda (excepto ARCHIVED)
  const getProductsForOwner = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${BASE_URL}/store/${store_id}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      console.error("❌ Error al cargar productos del dueño:", e);
      setError("No se pudieron cargar tus productos");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // 💸 Obtener productos en oferta por tienda (solo activos, tienda verificada)
  const getOffersByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/store/${store_id}/offers`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar las ofertas de esta tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/categories/${categoryId}/products`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos de esta categoría");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getFeaturedProductsByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/stores/${store_id}/featured`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos destacados de la tienda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Editar producto
  // Editar producto
  const updateProduct = async (id: number, product: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 🔹 Subir imágenes solo si son nuevos archivos
      const uploadIfFile = async (img: any) =>
        img instanceof File ? await uploadImage(img) : img || null;

      const image1Url = await uploadIfFile(product.image_1 ?? product.image);
      const image2Url = await uploadIfFile(product.image_2);
      const image3Url = await uploadIfFile(product.image_3);

      // 🔹 Construimos el payload con todas las propiedades
      const payload: any = {
        name: product.name,
        description: product.description,
        price: product.price,
        discount_price: product.discount_price ?? 0,
        stock: product.stock,
        status: product.status || "ACTIVE",
        is_featured: product.is_featured ?? false,
        image_1_url: image1Url,
        image_2_url: image2Url,
        image_3_url: image3Url,
      };

      // 🔹 Si las categorías existen, se incluyen también
      if (Array.isArray(product.categories) && product.categories.length > 0) {
        payload.category_ids = product.categories;
      }

      // 🔹 Enviamos el update al backend
      await axios.put(`${BASE_URL}/products/${id}`, payload);

      setSuccess("¡Producto editado con éxito!");
    } catch (e: any) {
      setError(
        "Error al editar el producto: " +
        (e.response?.data?.message || e.message)
      );
    } finally {
      setLoading(false);
    }
  };


  const getProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos");
      return [];
    } finally {
      setLoading(false);
    }
  };


  const getProductById = async (id: number): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products/${id}`);
      return normalizeProduct(res.data);
    } catch (e: any) {
      setError("No se pudo cargar el producto");
      return null;
    } finally {
      setLoading(false);
    }
  };


  const getProductsByStore = async (store_id: number): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/stores/${store_id}/products`);
      return res.data.map(normalizeProduct);
    } catch (e: any) {
      setError("No se pudieron cargar los productos");
      return [];
    } finally {
      setLoading(false);
    }
  };


  return {
    getProductById,
    getProductsByStore,
    getFeaturedProductsByStore,
    getProducts,
    getFeaturedProducts,
    getCategories,
    getProductsByCategory,
    createProduct,
    updateProduct,
    getProductsForOwner,
    getOffersByStore,
    searchProductsByStore,
    loading,
    error,
    success,
  };

}