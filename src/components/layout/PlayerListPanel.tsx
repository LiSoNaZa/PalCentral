import { For, Show } from "solid-js";
import { DashboardCard } from "../DashboardCard";
import { PlayerRow } from "../PlayerRow";
import { appState } from "../../store/store";

export function PlayerListPanel() {
  return (
    <main class="col-span-12 lg:col-span-6 flex flex-col lg:min-h-0 h-full order-first md:order-none">
      <DashboardCard
        title="Player List & Moderation"
        extraHeaderElement={
          <span class="bg-blue-950 text-blue-400 px-2 py-0.5 rounded text-xs font-mono font-bold">
            Total: {appState.playersData.length || 0}
          </span>
        }
        class="flex-1 flex flex-col min-h-0"
      >
        <div class="flex-1 overflow-y-auto space-y-2 mt-2 min-h-0">
          <Show
            when={appState.apiStatus === "connected" && appState.playersData.length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-xs">
                <p class="font-medium">
                  {appState.apiStatus === "error" ? "Connection lost" : "No players currently online"}
                </p>
              </div>
            }
          >
            <For each={appState.playersData}>
              {(player) => (
                <PlayerRow player={player} disabled={appState.apiStatus !== "connected"} />
              )}
            </For>
          </Show>
        </div>
      </DashboardCard>
    </main>
  );
}
