import { Show } from "solid-js";
import { AppAuth, apiStatus, credentials, isConnected, lastUpdated, serverInfoData } from "../../store/store";
import { Button } from "../ui/Button";

export function AppHeader() {
  return (
    <header class="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0 z-10">
      <div class="flex items-center space-x-3">
        <div
          class={`w-3 h-3 rounded-full transition-colors duration-500 ${
            apiStatus() === "connected"
              ? "bg-emerald-500 animate-pulse"
              : apiStatus() === "connecting"
                ? "bg-amber-500"
                : "bg-rose-500"
          }`}
        />
        <h1 class="text-lg font-bold tracking-wide uppercase truncate text-slate-200">
          {serverInfoData()?.servername || "PalCentral"}
        </h1>
      </div>

      <div class="flex items-center justify-end space-x-4 flex-1 ml-3">
        <div class="text-xs sm:text-sm text-slate-400 font-mono flex text-right flex-col flex-1 lg:flex-row justify-end flex-no-wrap">
          <div>
            <span class="hidden sm:inline">
              Server:&nbsp;
            </span>
            <span class="text-blue-400">
              {!isConnected() ? "None" : `${credentials().ip}:${credentials().port}`}
            </span>
          </div>
          <div>
            <span class="hidden lg:inline">
            &nbsp;— API:&nbsp;
            </span>
            <span class="hidden sm:inline" classList={{ "text-emerald-400": apiStatus() === "connected", "text-rose-400" : apiStatus() !== "connected"}}>
              {apiStatus() === "connected"
                ? "Connected"
                : apiStatus() === "connecting"
                  ? "Connecting..."
                  : "Offline"}
            </span>
            <span class="text-xs text-slate-600 ml-3">Sync: {lastUpdated()}</span>
          </div>
        </div>
        <Show when={isConnected()}>
          <Button variant="disconnect" onClick={() => AppAuth.disconnect()}>
            Disconnect / Edit
          </Button>
        </Show>
      </div>
    </header>
  );
}
