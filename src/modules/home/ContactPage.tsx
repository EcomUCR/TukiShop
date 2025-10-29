import { motion } from "framer-motion";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import ButtonComponent from "../../components/ui/ButtonComponent";
import useContactForm from "../../hooks/useContactForm";

export default function ContactPage() {
    const { fields, handleChange, handleSubmit, loading, sent, error } = useContactForm();

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
                    Contáctanos
                </motion.h1>
                <p className="max-w-2xl mx-auto text-lg text-white/90 px-4">
                    ¿Tenés alguna consulta, sugerencia o querés colaborar con nosotros?
                    Completá el formulario y te responderemos lo antes posible.
                </p>
            </section>

            <section className="flex justify-center w-full px-6 py-10 sm:py-16 font-quicksand">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-xl w-full max-w-[40rem]"
                >
                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Nombre completo</p>
                        <input
                            type="text"
                            name="name"
                            value={fields.name}
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
                            value={fields.email}
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
                            value={fields.subject}
                            onChange={handleChange}
                            placeholder="Ej. Colaboración con TukiShop"
                            className="rounded-xl p-2 border border-main/30 bg-transparent text-gray-800"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <p className="font-semibold text-main">Mensaje</p>
                        <textarea
                            name="message"
                            value={fields.message}
                            onChange={handleChange}
                            placeholder="Escribí tu mensaje aquí..."
                            className="rounded-2xl p-3 border border-main/30 bg-transparent text-gray-800 h-32 resize-none"
                            required
                        />
                    </label>

                    {sent && (
                        <p className="text-green-600 font-medium text-center">
                            ¡Mensaje enviado correctamente!
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 font-medium text-center">{error}</p>
                    )}

                    <ButtonComponent
                        type="submit"
                        text={loading ? "Enviando..." : "Enviar mensaje"}
                        style={`text-white text-lg py-2 rounded-full w-full sm:w-1/2 mx-auto ${loading
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
