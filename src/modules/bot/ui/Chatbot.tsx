import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "../../../hooks/context/ChatbotContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IconBubbleTextFilled } from "@tabler/icons-react";

export function Chatbot() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    streamingMessage,
    messagesEndRef,
    visible,
    toggleVisible,
  } = useChatbot();

  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toggleVisible();
  };

  // 👂 Cerrar si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        visible &&
        chatRef.current &&
        !chatRef.current.contains(e.target as Node)
      ) {
        toggleVisible();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, toggleVisible]);

  return (
    <>
      {/* 💬 Botón flotante */}
      <motion.div className="relative group">
        <motion.button
          onClick={toggleVisible}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: visible ? 0 : 1,
            opacity: visible ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed flex items-center bg-blue-600 text-white p-5 rounded-full shadow-2xl 
          transition-all duration-300 z-50 overflow-hidden 
          bottom-6 right-4 sm:bottom-8 sm:right-8 md:bottom-8 md:right-10 group-hover:bg-contrast-secondary"
          title="Abrir chat"
        >
          <IconBubbleTextFilled className="group-hover:rotate-360 transition-all duration-300" />
          <span
            className="whitespace-nowrap overflow-hidden w-0 opacity-0 transition-all duration-500 ease-in-out 
            group-hover:w-[9rem] group-hover:opacity-100 font-quicksand"
          >
            Chatear con Tuki
          </span>
        </motion.button>
      </motion.div>

      {/* 🧠 Chat animado */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={chatRef}
            key="chat"
            // 🔹 Animación original intacta
            initial={{
              scale: 0.2,
              opacity: 0,
              borderRadius: "50%",
              width: 64,
              height: 64,
              bottom: 24,
              right: 24,
              position: "fixed",
              transformOrigin: "bottom right",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              borderRadius: "20px",
              width: isMobile ? 350 : 420,
              height: isMobile ? 500 : 600,
              bottom: isMobile ? 80 : 96,
              right: isMobile ? 20 : 40,
              transition: {
                borderRadius: { duration: 0.25, ease: "easeOut" },
              },
            }}
            exit={{
              scale: 0.2,
              opacity: 0,
              borderRadius: "50%",
              width: 64,
              height: 64,
              bottom: 24,
              right: 24,
              transition: { duration: 0.35, ease: "easeInOut" },
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              duration: 0.45,
            }}
            className="fixed bg-white shadow-2xl border border-gray-300 flex flex-col p-5 z-50 
            origin-bottom-right rounded-2xl
            max-w-[420px] max-h-[600px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg font-fugaz text-blue-600">
                Tuki-Bot
              </h2>
              <button
                onClick={toggleVisible}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 text-base leading-relaxed scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl shadow-sm ${m.role === "user"
                      ? "bg-blue-500 text-white self-end ml-auto max-w-[85%]"
                      : "bg-gray-100 text-gray-800 self-start mr-auto max-w-[85%]"
                    }`}
                >
                  <p>{m.content}</p>
                  {m.products && m.products.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {m.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleProductClick(p.id)}
                          className="cursor-pointer border border-gray-200 rounded-lg p-2 text-sm bg-white hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                        >
                          <img
                            src={p.image_1_url}
                            alt={p.name}
                            className="w-full h-24 sm:h-28 object-cover rounded-md mb-1"
                          />
                          <p className="font-semibold truncate text-xs sm:text-sm">
                            {p.name}
                          </p>
                          <p className="text-gray-500 text-[11px] sm:text-xs truncate">
                            {p.store_name}
                          </p>
                          <p className="text-blue-600 font-bold text-xs sm:text-sm">
                            ₡{p.discount_price || p.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {streamingMessage && (
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-800">
                  {streamingMessage}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex gap-2 sm:gap-3 mt-auto items-center"
            >
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Enviar"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
