import { Show } from "solid-js";
import { AppAuth, appState } from "../../store/store";
import { Button } from "../ui/Button";

export function AppHeader() {
  return (
    <header class="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0 z-10">
      <div class="flex items-center space-x-3">
        <div
          class={`w-3 h-3 rounded-full transition-colors duration-500 ${
            appState.apiStatus === "connected"
              ? "bg-emerald-500 animate-pulse"
              : appState.apiStatus === "connecting"
                ? "bg-amber-500"
                : "bg-rose-500"
          }`}
        />
        <h1 class="text-lg font-bold tracking-wide uppercase truncate text-slate-200">
          {appState.serverInfoData?.servername || "PalCentral"}
        </h1>
      </div>

      <div class="flex items-center justify-end space-x-4 flex-1 ml-3">
        <div class="text-xs sm:text-sm text-slate-400 font-mono flex text-right flex-col flex-1 lg:flex-row justify-end flex-no-wrap">
          <div>
            <span class="hidden sm:inline">
              Server:&nbsp;
            </span>
            <span class="text-blue-400">
              {!appState.isConnected ? "None" : `${appState.credentials.ip}:${appState.credentials.port}`}
            </span>
          </div>
          <div>
            <span class="hidden lg:inline">
            &nbsp;— API:&nbsp;
            </span>
            <span class="hidden sm:inline" classList={{ "text-emerald-400": appState.apiStatus === "connected", "text-rose-400" : appState.apiStatus !== "connected"}}>
              {appState.apiStatus === "connected"
                ? "Connected"
                : appState.apiStatus === "connecting"
                  ? "Connecting..."
                  : "Offline"}
            </span>
            <span class="text-xs text-slate-600 ml-3">Sync: {appState.lastUpdated}</span>
          </div>
        </div>
        <Show when={appState.isConnected}>
          <Button variant="disconnect" onClick={() => AppAuth.disconnect()}>
            Disconnect / Edit
          </Button>
        </Show>
      </div>
    </header>
  );
}
