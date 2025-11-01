import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  image_1_url: string;
  store_name: string;
}

export interface Message {
  role: "user" | "bot";
  content: string;
  products?: Product[];
}

interface ChatbotContextType {
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  sendMessage: (e: React.FormEvent) => void;
  streamingMessage: string;
messagesEndRef: React.RefObject<HTMLDivElement | null>;
  toggleVisible: () => void;
  visible: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chatbot", { message: userMessage });
      const data = res.data;
      const botReply = data.message || "No tengo respuesta en este momento.";
      gradualDisplay(botReply, data.results);
    } catch (err) {
      console.error("❌ Error en chatbot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Hubo un error al procesar tu mensaje." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const gradualDisplay = (text: string, products?: Product[]) => {
    let index = 0;
    setStreamingMessage("");
    const words = text.split(" ");
    const interval = setInterval(() => {
      if (index < words.length) {
        setStreamingMessage((prev) => prev + (index > 0 ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: "bot", content: text, products }]);
        setStreamingMessage("");
      }
    }, 50);
  };

  const toggleVisible = () => setVisible((v) => !v);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        streamingMessage,
        messagesEndRef,
        visible,
        toggleVisible,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error("useChatbot debe usarse dentro de un ChatbotProvider");
  return context;
};
