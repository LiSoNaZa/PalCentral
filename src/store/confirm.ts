import { createSignal } from "solid-js";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => Promise<void> | void;
  onClose?: () => Promise<void> | void;
}

export const [confirmData, setConfirmData] = createSignal<ConfirmOptions | null>(null);

export function showConfirm(options: ConfirmOptions) {
  setConfirmData(options);
}

export function closeConfirm() {
  setConfirmData(null);
}