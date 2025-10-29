import { useState } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";
import ButtonComponent from "../../../components/ui/ButtonComponent";
import { motion } from "framer-motion";
import { useAlert } from "../../../hooks/context/AlertContext"; // 👈 Importa el contexto

export default function ReportProblemPage() {
    const { showAlert } = useAlert(); // 👈 Usa el hook aquí

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        description: "",
    });
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newPreviews = selectedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setFiles((prev) => [...prev, ...selectedFiles]);
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        await new Promise((res) => setTimeout(res, 1000)); // Simula envío

        // ✅ Mostrar alerta de éxito
        showAlert({
            title: "Mensaje enviado",
            message: "Tu reporte ha sido realizado correctamente",
            type: "success",
        });

        // ✅ Limpiar formulario
        setForm({ name: "", email: "", subject: "", description: "" });
        setFiles([]);
        setPreviews([]);
        setSending(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-light-gray to-white">
            <NavBar />
            <section className="text-center py-16 sm:py-20 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white font-quicksand">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Reportar un problema
                </motion.h1>
                <p className="max-w-2xl mx-auto text-lg text-white/90 px-4">
                    Si tuviste un inconveniente con tu pedido, pago o algún vendedor,
                    completá este formulario y nuestro equipo de soporte se pondrá en
                    contacto contigo.
                </p>
            </section>

            {/* Formulario */}
            <section className="flex justify-center w-full px-6 py-10 sm:py-16 font-quicksand">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-[40rem]"
                >
                    {/* Campos */}
                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Nombre completo</p>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ingresa tu nombre"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Correo electrónico</p>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Asunto</p>
                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Ej. Problema con mi pedido"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Descripción del problema</p>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Contanos qué sucedió..."
                            className="rounded-2xl p-3 border border-main/30 bg-transparent text-gray-800 h-32 resize-none"
                            required
                        />
                    </label>

                    {/* Adjuntar imágenes */}
                    <div className="flex flex-col gap-3">
                        <p className="font-semibold text-main">
                            Adjuntar evidencia (opcional)
                        </p>
                        <label className="flex items-center gap-3 cursor-pointer text-main font-medium w-fit">
                            <IconUpload />
                            <span>Subir imágenes</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFiles}
                                className="hidden"
                            />
                        </label>

                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-2 overflow-x-auto pb-2">
                                {previews.map((src, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative group"
                                    >
                                        <img
                                            src={src}
                                            alt={`Evidencia ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botón */}
                    <ButtonComponent
                        type="submit"
                        text={sending ? "Enviando..." : "Enviar reporte"}
                        style={`text-white text-lg py-2 rounded-full w-full sm:w-1/2 mx-auto ${sending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-contrast-main hover:bg-contrast-secondary transition-all duration-300"
                            }`}
                    />
                </form>
            </section>

            <Footer />
        </div>
    );
}
