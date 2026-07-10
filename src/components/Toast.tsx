import { For } from "solid-js";
import { toasts } from "../store/toast";

export function ToastContainer() {
  return (
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`p-3 rounded-xl border shadow-xl flex items-center justify-between text-xs font-medium pointer-events-auto animate-fade-in transition-all duration-300 ${
              toast.type === "success" 
                ? "bg-emerald-950/90 border-emerald-800 text-emerald-400" 
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-800 text-rose-400"
                : "bg-slate-900/90 border-slate-800 text-slate-300"
            }`}
          >
            <div class="flex items-center space-x-2">
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}