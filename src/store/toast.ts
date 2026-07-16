import { createStore, produce } from "solid-js/store";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export const [toastState, setToastState] = createStore<{ toasts: Toast[] }>({ toasts: [] });

let toastId = 0;

export const showToast = (message: string, type: Toast["type"] = "info") => {
  const id = ++toastId;
  
  setToastState("toasts", produce((toasts) => {
    toasts.push({ id, message, type });
  }));

  setTimeout(() => {
    setToastState("toasts", (toasts) => toasts.filter((t) => t.id !== id));
  }, 4000);
};
