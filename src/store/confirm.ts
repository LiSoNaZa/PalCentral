import { createStore } from "solid-js/store";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => Promise<void> | void;
  onClose?: () => Promise<void> | void;
}

export const [confirmState, setConfirmState] = createStore<{ data: ConfirmOptions | null }>({ data: null });

export function showConfirm(options: ConfirmOptions) {
  setConfirmState("data", options);
}

export function closeConfirm() {
  setConfirmState("data", null);
}
