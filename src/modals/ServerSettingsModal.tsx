import { createSignal, For, Show } from "solid-js";
import type { ServerSettings } from "../api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ServerSettings | null;
}

export function SettingsModal(props: SettingsModalProps) {
  const [searchQuery, setSearchQuery] = createSignal("");

  const filteredSettings = () => {
    if (!props.settings) return [];
    const query = searchQuery().toLowerCase();
    
    return Object.entries(props.settings).filter(([key, value]) => 
      key.toLowerCase().includes(query) || String(value).toLowerCase().includes(query)
    );
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={props.onClose}>
        <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[85vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
          
          <div class="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-base font-bold text-slate-200">All Server Settings</h3>
              <p class="text-xs text-slate-400">Live configuration from your server</p>
            </div>
            <button 
              onClick={props.onClose}
              class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              Close
            </button>
          </div>

          <div class="p-4 bg-slate-950/40 border-b border-slate-800/60 shrink-0">
            <div class="relative">
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 text-slate-200"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs">
            <For each={filteredSettings()}>
              {([key, value]) => (
                <div class="flex items-center justify-between p-2 bg-slate-950/30 border border-slate-800/40 rounded-lg">
                  <span class="text-slate-400 font-sans font-medium break-all pr-4">{key}</span>
                  <span class="shrink-0 text-right">
                    {typeof value === "boolean" ? (
                      <span class={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        value ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {String(value).toUpperCase()}
                      </span>
                    ) : (
                      <span class="text-blue-300 font-bold break-all">{String(value)}</span>//TODO: Round server settings
                    )}
                  </span>
                </div>
              )}
            </For>
          </div>

          <div class="p-3 bg-slate-950/60 border-t border-slate-800 text-right text-[10px] text-slate-500 rounded-b-2xl">
            Showing {filteredSettings().length} variables
          </div>
        </div>
      </div>
    </Show>
  );
}