import { createContext, useContext, useState } from "react";

import { ReactNode } from "react";

const ToastContext = createContext<ToastContextValue>({
  toast: null,
  showToast: () => null,
  hideToast: () => null,
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(toast: Toast) {
    setToast(toast);
    setTimeout(() => {
      hideToast();
    }, toast.duration);
  }

  function hideToast() {
    setToast(null);
  }

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
      {toast && <ToastNoitification {...toast} />}
    </ToastContext.Provider>
  );
}

export function ToastNoitification({ message, type }: Toast) {
  return (
    <div
      style={{
        position: "fixed",
        top: "4rem",
        right: "1rem",
        padding: "1rem",
        backgroundColor: type === "success" ? "green" : "red",
        color: "white",
        borderRadius: "4px",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}

interface Toast {
  message: string;
  type: "success" | "error";
  duration: number;
}

interface ToastContextValue {
  toast: Toast | null;
  showToast: (toast: Toast) => void;
  hideToast: () => void;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}