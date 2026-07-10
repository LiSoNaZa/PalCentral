import { createSignal } from "solid-js";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const [toasts, setToasts] = createSignal<Toast[]>([]);
let toastId = 0;

export { toasts };

export const showToast = (message: string, type: Toast["type"] = "info") => {
  const id = ++toastId;
  
  setToasts((prev) => [...prev, { id, message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 4000);
};