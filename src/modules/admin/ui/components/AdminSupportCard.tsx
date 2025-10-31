import {
    IconAlertCircle,
    IconSend,
    IconUser,
    IconCheck,
    IconPhoto,
    IconMessageCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import AlertComponent from "../../../../components/data-display/AlertComponent";

interface AdminSupportCardProps {
    id: number;
    name: string;
    email: string;
    order_number?: string;
    subject: string;
    description: string;
    images?: string[];
    created_at: string;
    status: "PENDING" | "RESOLVED";
    onMarkResolved: () => void;
}

export default function AdminSupportCard({
    name,
    email,
    order_number,
    subject,
    description,
    images = [],
    created_at,
    status,
    onMarkResolved,
}: AdminSupportCardProps) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        message: string;
    } | null>(null);

    const openAlert = (title: string, message: string) => {
        setAlertConfig({ title, message });
        setAlertVisible(true);
    };

    const closeAlert = () => setAlertVisible(false);

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            openAlert("Mensaje vacío", "Por favor escribe una respuesta antes de enviar.");
            return;
        }

        setSending(true);
        await new Promise((res) => setTimeout(res, 1000)); // simulación de envío
        openAlert("Respuesta enviada", `Tu mensaje fue enviado a ${email}.`);
        setSending(false);
        setReplyText("");
        setReplyOpen(false);
    };

    return (
        <>
            <div
                className={`w-full bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 p-5 font-quicksand ${status === "RESOLVED" ? "opacity-80" : "hover:shadow-md"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconAlertCircle
                            className={status === "PENDING" ? "text-red-500" : "text-green-500"}
                            size={24}
                        />
                        <h3
                            className={`font-semibold ${status === "RESOLVED"
                                    ? "text-gray-500 line-through"
                                    : "text-main"
                                }`}
                        >
                            {subject}
                        </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                        {new Date(created_at).toLocaleString("es-CR")}
                    </span>
                </div>

                {/* Contenido principal */}
                <div className="mt-3 text-gray-700 text-sm leading-relaxed">
                    <div className="flex items-center gap-2 mb-1 text-main font-semibold">
                        <IconUser size={16} /> {name}
                    </div>
                    <p className="text-xs text-gray-500">
                        <strong>Email:</strong> {email}
                    </p>
                    {order_number && (
                        <p className="text-xs text-gray-500">
                            <strong>Número de orden:</strong> {order_number}
                        </p>
                    )}

                    <p className="mt-3 text-gray-700">{description}</p>

                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                            {images.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={src}
                                        alt={`Evidencia ${i + 1}`}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center rounded-lg">
                                        <IconPhoto size={18} className="text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botones */}
                    {!replyOpen ? (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => setReplyOpen(true)}
                                        className="flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-contrast-secondary transition-all"
                                    >
                                        <IconMessageCircle size={14} /> Responder
                                    </button>
                                    <button
                                        onClick={onMarkResolved}
                                        className="flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all"
                                    >
                                        <IconCheck size={14} /> Marcar resuelto
                                    </button>
                                </>
                            )}
                            {status === "RESOLVED" && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                    <IconCheck size={14} /> Resuelto
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col gap-3">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Escribe tu respuesta aquí..."
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main/40 resize-none"
                            />
                            <p className="text-[11px] text-gray-500">
                                ✉️ La respuesta será enviada a <strong>{email}</strong>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    className={`flex items-center gap-2 bg-main text-white text-xs font-semibold px-4 py-2 rounded-full transition-all ${sending
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:bg-contrast-secondary"
                                        }`}
                                >
                                    <IconSend size={14} />
                                    {sending ? "Enviando..." : "Enviar"}
                                </button>
                                <button
                                    onClick={() => setReplyOpen(false)}
                                    disabled={sending}
                                    className="flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alerta */}
            <AlertComponent
                show={alertVisible}
                title={alertConfig?.title}
                message={alertConfig?.message}
                confirmText="Aceptar"
                onConfirm={closeAlert}
            />
        </>
    );
}
