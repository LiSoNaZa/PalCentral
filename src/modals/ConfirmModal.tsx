import { createSignal, Show } from "solid-js";
import { confirmData, closeConfirm } from "../store/confirm";

export function ConfirmModal() {
  const [isProcessing, setIsProcessing] = createSignal(false);

  const handleConfirm = async () => {
    const data = confirmData();
    if (!data || isProcessing()) return;

    setIsProcessing(true);
    try {
      await data.onConfirm();
      closeConfirm();
    } catch (err) {
      console.error("Error executing global confirm action:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = async () => {
    const data = confirmData();
    if (!data || isProcessing()) return;

    setIsProcessing(true);
    try {
      await data.onClose?.();
      closeConfirm();
    } catch (err) {
      console.error("Error executing global close action:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const colors = {
    danger: "bg-rose-600 hover:bg-rose-500 text-white disabled:bg-rose-900/40 text-rose-400",
    warning: "bg-amber-600 hover:bg-amber-500 text-white disabled:bg-amber-900/40 text-amber-400",
    info: "bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-900/40 text-blue-400"
  };

  return (
    <Show when={confirmData() !== null}>
      <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-default"
        onClick={handleClose}
      >
        <div 
          class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl animate-fade-in flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex items-start space-x-3">
            <div class={`p-2 rounded-lg shrink-0 bg-slate-950/40 border border-slate-800 ${colors[confirmData()!.variant].split(" ")[3]}`}>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-200">{confirmData()!.title}</h3>
              <p class="text-xs text-slate-400 mt-1">{confirmData()!.description}</p>
            </div>
          </div>

          <div class="flex space-x-2 justify-end mt-5 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              disabled={isProcessing()}
              onClick={handleClose}
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition disabled:opacity-40"
            >
              Cancel
            </button>
            
            <button
              type="button"
              disabled={isProcessing()}
              onClick={handleConfirm}
              class={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${colors[confirmData()!.variant].split(" ").slice(0, 3).join(" ")}`}
            >
              <Show when={isProcessing()} fallback={<span>{confirmData()!.confirmText}</span>}>
                <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </Show>
            </button>
          </div>

        </div>
      </div>
    </Show>
  );
}