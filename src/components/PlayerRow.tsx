import { createSignal, Show } from "solid-js";
import type { Player } from "../api";
import { AppActions, apiStatus } from "../store/store";
import { showToast } from "../store/toast";

interface PlayerRowProps {
  player: Player;
  disabled?: boolean;
}

export function PlayerRow(props: PlayerRowProps) {
  const [modalType, setModalType] = createSignal<"kick" | "ban" | null>(null);
  const [reason, setReason] = createSignal("");
  const [isProcessing, setIsProcessing] = createSignal(false);

  const formatLocation = (x: number, y: number) => {
    return `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
  };

  const closeModal = () => {
    setModalType(null);
    setReason("");
    setIsProcessing(false);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const currentReason = reason().trim();
    const type = modalType();
    
    if (!currentReason || isProcessing() || !type) return;

    setIsProcessing(true);
    let success = false;

    if (type === "kick") {
      success = await AppActions.kickPlayer(props.player.playerId, currentReason);
    } else {
      success = await AppActions.banPlayer(props.player.playerId, currentReason);
    }

    if (success) {
      showToast(`Successfully ${type === "kick" ? "kicked" : "banned"} ${props.player.name}`, "success");
      closeModal();
    } else {
      showToast(`Failed to ${type} player.`, "error");
      setIsProcessing(false);
    }
  };

  return (
    <div class="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700/60 hover:bg-slate-950/70 transition-all duration-200">
      
      <div class="min-w-0 flex-1 flex items-start space-x-3">
        <div class="shrink-0 w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex flex-col items-center justify-center">
          <span class="text-[10px] text-blue-400 font-sans uppercase font-bold leading-none">Lvl</span>
          <span class="text-sm text-slate-200 font-bold font-mono">{props.player.level}</span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center space-x-2 flex-wrap">
            <span class="font-semibold text-sm text-slate-200 truncate">{props.player.name}</span>
            <span class="text-[11px] text-slate-400 font-mono">({props.player.accountName})</span>
          </div>
          
          <div class="flex flex-col gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-500 mt-0.5">
            <span class="truncate">UID:&nbsp;<span class="text-slate-400">{props.player.playerId}</span></span>
            <span class="truncate">IP:&nbsp;<span class="text-slate-400">{props.player.ip}</span></span>
            <span class="truncate">Buildings:&nbsp;<span class="text-slate-400">{props.player.building_count}</span></span>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center space-x-2 shrink-0 self-end sm:self-auto mb-2">
          <span class={`px-2 py-0.5 font-mono text-[10px] rounded-md border ${
            props.player.ping < 50 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            props.player.ping < 120 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {props.player.ping.toFixed(0)}ms
          </span>
          
          <span class="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] rounded-md">
            {formatLocation(props.player.location_x, props.player.location_y)}
          </span>
        </div>

        <div class="flex space-x-2 shrink-0 justify-between border-t border-slate-800/40 pt-2 sm:pt-0 sm:border-none">
          <button 
            onClick={() => setModalType("kick")} 
            disabled={props.disabled || apiStatus() !== 'connected'}
            class="px-3 py-1 text-xs rounded-lg transition font-semibold bg-amber-600/10 hover:bg-amber-600/30 text-amber-400 border border-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex-1"
          >
            Kick
          </button>
          <button 
            onClick={() => setModalType("ban")} 
            disabled={props.disabled || apiStatus() !== 'connected'}
            class="px-3 py-1 text-xs rounded-lg transition font-semibold bg-rose-600/10 hover:bg-rose-600/30 text-rose-400 border border-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex-1"
          >
            Ban
          </button>
        </div>
      </div>

      <Show when={modalType() !== null}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-default" onClick={closeModal}>
          <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            
            <h3 class="text-base font-bold text-slate-200 capitalize">
              {modalType() === "kick" ? "Kick Player" : "Ban Player"}
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Are you sure you want to {modalType()} <span class="text-slate-200 font-semibold">{props.player.name}</span>?
            </p>

            <form onSubmit={handleSubmit} class="mt-4 space-y-3">
              <div>
                <label class="block text-[11px] font-medium text-slate-400 mb-1">Reason (Required)</label>
                <textarea
                  disabled={isProcessing()}
                  placeholder={modalType() === "kick" ? "Reason for kick (e.g., AFK, Spamming)..." : "Reason for permanent ban..."}
                  value={reason()}
                  onInput={(e) => setReason(e.currentTarget.value)}
                  rows={3}
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-slate-200 disabled:opacity-40 resize-none min-h-[70px]"
                />
              </div>

              <div class="flex space-x-2 justify-end pt-2">
                <button
                  type="button"
                  disabled={isProcessing()}
                  onClick={closeModal}
                  class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason().trim() || isProcessing()}
                  class={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 text-white ${
                    modalType() === "kick" 
                      ? "bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900/40 disabled:text-amber-700" 
                      : "bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/40 disabled:text-rose-700"
                  }`}
                >
                  <Show when={isProcessing()} fallback={<span class="capitalize">{modalType()} Player</span>}>
                    <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </Show>
                </button>
              </div>
            </form>

          </div>
        </div>
      </Show>

    </div>
  );
}