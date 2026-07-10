import { Show, splitProps, type JSX } from "solid-js";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "header"
  | "disconnect"
  | "maintenance-success"
  | "maintenance-warning"
  | "maintenance-warning-inline"
  | "maintenance-danger";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  children: JSX.Element;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium rounded-lg text-xs transition shadow-md flex items-center justify-center space-x-1",
  secondary:
    "w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-300 font-semibold rounded-lg text-xs transition flex items-center justify-center space-x-1 border border-slate-700/50 disabled:border-transparent",
  header:
    "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] transition disabled:opacity-30 font-medium whitespace-nowrap",
  disconnect:
    "px-3 py-1 text-xs bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-md border border-slate-700 transition",
  "maintenance-success":
    "w-full py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-900/50 rounded text-xs transition disabled:opacity-30 disabled:cursor-not-allowed",
  "maintenance-warning":
    "w-full py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-900/50 rounded text-xs transition disabled:opacity-30 disabled:cursor-not-allowed",
  "maintenance-warning-inline":
    "flex-1 py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-900/50 rounded text-xs transition disabled:opacity-30 disabled:cursor-not-allowed",
  "maintenance-danger":
    "w-full py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-900/50 rounded text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed",
};

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "loading", "loadingText", "children", "class"]);
  const spinnerClass = () => (local.variant === "secondary" ? "border-slate-400" : "border-slate-300");

  return (
    <button
      class={`${variantClasses[local.variant ?? "primary"]} ${local.class || ""}`}
      {...rest}
    >
      <Show when={local.loading} fallback={local.children}>
        <LoadingSpinner class={spinnerClass()} />
        <span>{local.loadingText}</span>
      </Show>
    </button>
  );
}
