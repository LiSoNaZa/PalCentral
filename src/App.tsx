import { onMount } from "solid-js";
import { AppAuth } from "./store/store";
import { ToastContainer } from "./components/Toast";
import { AppModals } from "./components/layout/AppModals";
import { AppHeader } from "./components/layout/AppHeader";
import { ServerSidebar } from "./components/layout/ServerSidebar";
import { PlayerListPanel } from "./components/layout/PlayerListPanel";
import { ModerationSidebar } from "./components/layout/ModerationSidebar";

function App() {
  onMount(() => {
    AppAuth.loadFromStorage();
  });

  return (
    <div class="w-screen h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      <AppModals />
      <AppHeader />

      <div class="flex-1 flex flex-col md:grid md:grid-cols-12 gap-4 p-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <ServerSidebar />
        <PlayerListPanel />
        <ModerationSidebar />
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
