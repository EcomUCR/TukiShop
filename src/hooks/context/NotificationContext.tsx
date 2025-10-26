import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  storeToOpen: number | null;
  setStoreToOpen: (id: number | null) => void;
  clearStoreToOpen: () => void; // ✅ agregar esta función
}

const NotificationContext = createContext<NotificationContextType>({
  storeToOpen: null,
  setStoreToOpen: () => {},
  clearStoreToOpen: () => {}, // ✅ valor por defecto vacío
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [storeToOpen, setStoreToOpen] = useState<number | null>(null);

  // ✅ nueva función para limpiar
  const clearStoreToOpen = () => setStoreToOpen(null);

  return (
    <NotificationContext.Provider
      value={{ storeToOpen, setStoreToOpen, clearStoreToOpen }} // ✅ incluirla en el provider
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
