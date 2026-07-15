import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import { PalworldAPI, type CharacterActor, type PalBoxActor, type PalworldGameDataResponse } from "../api";
import { appState } from "../store/store";
import { showToast } from "../store/toast";

interface GameDataModalProps {
  onClose: () => void;
}

export function GameDataModal(props: GameDataModalProps) {
  const [data, setData] = createSignal<PalworldGameDataResponse | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const loadGameData = async () => {
    if (appState.apiStatus !== "connected") return;
    setIsLoading(true);
    try {
      const response = await PalworldAPI.getGameData();
      setData(response);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch live game data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadGameData();
  });

  const palBoxes = createMemo(() => {
    return (data()?.ActorData.filter((a) => a.Type === "PalBox") || []) as PalBoxActor[];
  });

  const players = createMemo(() => {
    return (data()?.ActorData.filter((a) => a.Type === "Character" && a.UnitType === "Player") || []) as CharacterActor[];
  });

  const worldPalsCount = createMemo(() => {
    return (data()?.ActorData.filter((a) => a.Type === "Character" && a.UnitType !== "Player") || []).length;
  });

  return (
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 cursor-default"
      onClick={props.onClose}
    >
      <div 
        class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[85vh] shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div class="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 class="text-base font-bold text-slate-200">World Explorer & Entities</h3>
            <p class="text-xs text-slate-400">Live snapshot of actors, locations and map state</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              disabled={isLoading() || appState.apiStatus !== "connected"}
              onClick={loadGameData}
              class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition disabled:opacity-40 flex items-center justify-center"
              title="Refresh Data"
            >
              <svg 
                class={`w-4 h-4 ${isLoading() ? "animate-spin text-blue-400" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
                />
              </svg>
            </button>
            <button 
              onClick={props.onClose}
              class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4 mac-scrollbar min-h-0">
          <Show 
            when={!isLoading() && data()} 
            fallback={
              <div class="flex flex-col items-center justify-center py-20 text-slate-500 text-xs">
                <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p class="font-medium">Reading massive game-data structure...</p>
              </div>
            }
          >
            <div class="grid grid-cols-3 gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center font-mono text-xs">
              <div>
                <span class="block text-[10px] text-slate-500 uppercase font-sans mb-0.5">Snapshot Time</span>
                <span class="text-blue-400 font-bold">{data()?.Time}</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500 uppercase font-sans mb-0.5">Engine Tick Rate</span>
                <span class="text-emerald-400 font-bold">{data()?.FPS.toFixed(2)} FPS</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500 uppercase font-sans mb-0.5">Average Performance</span>
                <span class="text-amber-400 font-bold">{data()?.AverageFPS.toFixed(2)} FPS</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center font-sans">
              <div class="p-2.5 bg-slate-950/30 border border-slate-800/60 rounded-xl">
                <span class="block text-[10px] text-slate-400">Total Tracked Actors</span>
                <span class="text-base font-mono font-bold text-slate-200">{data()?.ActorData.length}</span>
              </div>
              <div class="p-2.5 bg-slate-950/30 border border-slate-800/60 rounded-xl">
                <span class="block text-[10px] text-slate-400">Active Guild PalBoxes</span>
                <span class="text-base font-mono font-bold text-slate-200">{palBoxes().length}</span>
              </div>
              <div class="p-2.5 bg-slate-950/30 border border-slate-800/60 rounded-xl">
                <span class="block text-[10px] text-slate-400">Pals (Base & Wild)</span>
                <span class="text-base font-mono font-bold text-slate-200">{worldPalsCount()}</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider px-1">
                Active Guild PalBoxes ({palBoxes().length})
              </h4>
              <Show when={palBoxes().length > 0} fallback={<div class="text-[11px] italic text-slate-600 px-1">No PalBoxes placed on the map.</div>}>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <For each={palBoxes()}>
                    {(box) => (
                      <div class="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/50 rounded-xl text-xs font-mono">
                        <div class="truncate pr-2">
                          <span class="text-slate-300 font-sans font-medium block truncate">{box.GuildName || "No Guild Name"}</span>
                          <span class="text-[10px] text-slate-500 block truncate">ID: {box.GuildID?.slice(0, 8)}...</span>
                        </div>
                        <span class="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 shrink-0">
                          X:{Math.round(box.LocationX)} Y:{Math.round(box.LocationY)}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>

            <div class="space-y-1.5">
              <h4 class="text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider px-1">
                Character / Player Locations ({players().length})
              </h4>
              <Show when={players().length > 0} fallback={<div class="text-[11px] italic text-slate-600 px-1">No players coordinates stored in this frame.</div>}>
                <div class="space-y-1">
                  <For each={players()}>
                    {(ply) => (
                      <div class="flex items-center justify-between p-2 bg-slate-950/20 border border-slate-800/30 rounded-xl text-xs font-mono">
                        <div class="flex items-center space-x-2 truncate">
                          <span class="w-2 h-2 rounded-full bg-blue-500" />
                          <span class="text-slate-200 font-sans font-medium truncate">{ply.NickName || "Player"}</span>
                          <span class="text-[10px] text-slate-500 hidden sm:inline">Lvl {ply.level}</span>
                        </div>
                        <span class="text-[10px] text-blue-400 bg-blue-950/20 border border-blue-900/30 px-2 py-0.5 rounded shrink-0">
                          X:{Math.round(ply.LocationX)} Y:{Math.round(ply.LocationY)} Z:{Math.round(ply.LocationZ)}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>

          </Show>
        </div>
        <div class="p-3 bg-slate-950/60 border-t border-slate-800 text-right text-[10px] text-slate-500 rounded-b-2xl">
          Data format validated strictly via TypeScript Definitions
        </div>
      </div>
    </div>
  );
}