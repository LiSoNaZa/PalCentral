import { createSignal, Show } from "solid-js";
import { DashboardCard } from "../DashboardCard";
import { DataList } from "../DataList";
import { Button } from "../ui/Button";
import { appState } from "../../store/store";
import { formatMetrics, formatServerInfo, previewSettings } from "../../utils/dashboardFormatters";
import { SettingsModal } from "../../modals/ServerSettingsModal";
import { GameDataModal } from "../../modals/GameDataModal";
import { InteractiveMapModal } from "../../modals/InteractiveMapModal";

const WORLD_EXPLORER_ENABLED = false;

export function ServerSidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isInteractiveMapOpen, setIsInteractiveMapOpen] = createSignal(false);
  const [isGameDataOpen, setIsGameDataOpen] = createSignal(false);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen()}
        onClose={() => setIsSettingsOpen(false)}
        settings={appState.serverSettingsData}
      />
      <InteractiveMapModal
        isOpen={isInteractiveMapOpen()}
        onClose={() => setIsInteractiveMapOpen(false)}
        players={appState.playersData}
      />
      <Show when={isGameDataOpen()}>
        <GameDataModal onClose={() => setIsGameDataOpen(false)} />
      </Show>

      <aside class="col-span-12 lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-4 shrink-0 lg:shrink h-[900px] md:h-[300px] lg:min-h-0 lg:h-full">
        <DashboardCard title="Server Info" class="flex-1 min-h-0 overflow-y-auto" extraHeaderElement={
            <Button
              variant="header"
              disabled={appState.apiStatus !== "connected"}
              onClick={() => setIsInteractiveMapOpen(true)}
            >
              Open Map
            </Button>
          }>
          <DataList items={formatServerInfo()} />
        </DashboardCard>

        <DashboardCard title="Live Metrics" class="flex-1 min-h-0 flex flex-col h-full">
          <div class="h-[100%] flex flex-col">
            <div class="flex-1 overflow-y-auto min-h-0 mac-scrollbar">
              <DataList items={formatMetrics()} />
            </div>

            <Show when={WORLD_EXPLORER_ENABLED}>
              <Button
                variant="primary"
                disabled={appState.apiStatus !== "connected"}
                onClick={() => setIsGameDataOpen(true)}
                class="w-full mt-3 font-semibold shrink-0 border border-blue-500/20 disabled:border-transparent"
              >
                <span>Open World Explorer</span>
              </Button>
            </Show>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Server Settings"
          class="flex-1 md:flex-2 lg:flex-1 min-h-0 min-w-0 flex flex-col"
          extraHeaderElement={
            <Button
              variant="header"
              disabled={appState.apiStatus !== "connected"}
              onClick={() => setIsSettingsOpen(true)}
            >
              View all
            </Button>
          }
        >
          <Show
            when={appState.apiStatus === "connected"}
            fallback={
              <div class="text-center py-4 text-xs text-slate-500 italic">
                Settings locked while offline
              </div>
            }
          >
            <div class="flex-1 overflow-y-auto min-h-0">
              <DataList items={previewSettings()} />
            </div>
          </Show>
        </DashboardCard>
      </aside>
    </>
  );
}
