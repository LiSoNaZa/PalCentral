import { createSignal, Show } from "solid-js";
import { DashboardCard } from "../DashboardCard";
import { DataList } from "../DataList";
import { Button } from "../ui/Button";
import { apiStatus, serverSettingsData } from "../../store/store";
import { formatMetrics, formatServerInfo, previewSettings } from "../../utils/dashboardFormatters";
import { SettingsModal } from "../../modals/ServerSettingsModal";
import { GameDataModal } from "../../modals/GameDataModal";

const WORLD_EXPLORER_ENABLED = false;

export function ServerSidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
  const [isGameDataOpen, setIsGameDataOpen] = createSignal(false);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen()}
        onClose={() => setIsSettingsOpen(false)}
        settings={serverSettingsData()}
      />
      <Show when={isGameDataOpen()}>
        <GameDataModal onClose={() => setIsGameDataOpen(false)} />
      </Show>

      <aside class="col-span-3 flex flex-col gap-4 shrink-0 md:shrink md:min-h-0 h-full">
        <DashboardCard title="Server Info" class="flex-2 min-h-0 overflow-y-auto">
          <DataList items={formatServerInfo()} />
        </DashboardCard>

        <DashboardCard title="Live Metrics" class="flex-2 min-h-0 flex flex-col h-full">
          <div class="h-[100%] flex flex-col">
            <div class="flex-1 overflow-y-auto min-h-0 pr-1 mac-scrollbar">
              <DataList items={formatMetrics()} />
            </div>

            <Show when={WORLD_EXPLORER_ENABLED}>
              <Button
                variant="primary"
                disabled={apiStatus() !== "connected"}
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
          class="flex-1 min-h-0 flex flex-col"
          extraHeaderElement={
            <Button
              variant="header"
              disabled={apiStatus() !== "connected"}
              onClick={() => setIsSettingsOpen(true)}
            >
              View all
            </Button>
          }
        >
          <Show
            when={apiStatus() === "connected"}
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
