import { createSignal } from "solid-js";
import { DashboardCard } from "../DashboardCard";
import { MaintenanceAction } from "../MaintenanceAction";
import { Button } from "../ui/Button";
import { FormInput } from "../ui/FormInput";
import { FormTextarea } from "../ui/FormTextarea";
import { AppActions, apiStatus } from "../../store/store";
import { showConfirm } from "../../store/confirm";
import { showToast } from "../../store/toast";

export function ModerationSidebar() {
  const [messageText, setMessageText] = createSignal("");
  const [isMessageTransmitting, setIsMessageTransmitting] = createSignal(false);

  const [unbanUserId, setUnbanUserId] = createSignal("");
  const [isUnbanTransmitting, setIsUnbanTransmitting] = createSignal(false);

  const [shutdownSec, setShutdownSec] = createSignal(60);
  const [shutdownMsg, setShutdownMsg] = createSignal("");
  const [isShutdownTransmitting, setIsShutdownTransmitting] = createSignal(false);

  const [isServerStopTransmitting, setIsServerStopTransmitting] = createSignal(false);

  const offlinePlaceholder = (online: string) =>
    apiStatus() === "connected" ? online : "Unavailable — Server Offline";

  const handleSendAnnouncement = async () => {
    if (!messageText().trim() || isMessageTransmitting()) return;

    setIsMessageTransmitting(true);
    const success = await AppActions.broadcastMessage(messageText());
    setIsMessageTransmitting(false);

    if (success) {
      setMessageText("");
      showToast("Announcement successfully broadcasted!", "success");
    } else {
      showToast("Failed to send announcement. Check server connection", "error");
    }
  };

  const handleUnbanPlayer = async () => {
    if (!unbanUserId().trim() || isUnbanTransmitting()) return;

    setIsUnbanTransmitting(true);
    const success = await AppActions.unbanPlayer(unbanUserId());
    setIsUnbanTransmitting(false);

    if (success) {
      setUnbanUserId("");
      showToast("Player successfully unbanned!", "success");
    } else {
      showToast("Failed to unban player. Check server connection", "error");
    }
  };

  const handleSave = async () => {
    const success = await AppActions.saveWorld();

    if (success) {
      showToast("World successfully saved!", "success");
    } else {
      showToast("Failed to save world. Check server connection", "error");
    }
  };

  const handleGracefulShutdown = () => {
    const seconds = shutdownSec();
    const message = shutdownMsg().trim();
    if (seconds == undefined || !message || isShutdownTransmitting()) return;

    setIsShutdownTransmitting(true);
    showConfirm({
      title: "Confirm Graceful Shutdown",
      description: `Shut down the server in ${seconds} seconds?`,
      confirmText: "Start Shutdown",
      variant: "warning",
      onConfirm: async () => {
        const success = await AppActions.shutdownServer(seconds, message);
        setIsShutdownTransmitting(false);
        if (success) {
          setShutdownMsg("");
          setShutdownSec(60);
          showToast("Shutdown successfully initiated!", "success");
        } else {
          showToast("Failed to initiated shutdown. Check server connection", "error");
        }
      },
      onClose() {
        setIsShutdownTransmitting(false);
      },
    });
  };

  const handleForceStop = () => {
    if (isServerStopTransmitting()) return;

    showConfirm({
      title: "Confirm force stop",
      description:
        "Attention: Do you really want to force stop the Server? Unsaved progress might get lost!",
      confirmText: "Force Stop",
      variant: "danger",
      onConfirm: async () => {
        setIsServerStopTransmitting(true);
        const success = await AppActions.forceShutdownServer();
        setIsServerStopTransmitting(false);
        if (success) {
          setShutdownMsg("");
          showToast("Force stop successfully initiated!", "success");
        } else {
          showToast("Failed to initiated force stop. Check server connection", "error");
        }
      },
      onClose() {
        setIsServerStopTransmitting(false);
      },
    });
  };

  return (
    <aside class="col-span-12 lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-4 shrink-0 lg:shrink h-[900px] md:h-[300px] lg:min-h-0 lg:h-full">
      <DashboardCard title="Announce Message" class="flex-1">
        <div class="flex-1 space-y-2 flex flex-col h-full">
          <FormTextarea
            disabled={apiStatus() !== "connected" || isMessageTransmitting()}
            placeholder={offlinePlaceholder("Broadcast text to all players...")}
            value={messageText()}
            onInput={(e) => setMessageText(e.currentTarget.value)}
            rows={3}
          />
          <Button
            variant="primary"
            disabled={apiStatus() !== "connected" || !messageText().trim() || isMessageTransmitting()}
            onClick={handleSendAnnouncement}
            loading={isMessageTransmitting()}
            loadingText="Sending..."
          >
            <span>Send Announcement</span>
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard title="Unban Player" class="flex-1">
        <div class="space-y-2 flex-1">
          <FormInput
            type="text"
            disabled={apiStatus() !== "connected" || isUnbanTransmitting()}
            placeholder={offlinePlaceholder("PlayerID")}
            value={unbanUserId()}
            onInput={(e) => setUnbanUserId(e.currentTarget.value)}
          />
          <Button
            variant="secondary"
            disabled={apiStatus() !== "connected" || !unbanUserId().trim() || isUnbanTransmitting()}
            onClick={handleUnbanPlayer}
            loading={isUnbanTransmitting()}
            loadingText="Processing..."
          >
            <span>Revoke Ban</span>
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard title="Server Maintenance" titleColorClass="text-rose-500" class="flex-1 md:flex-2 min-h-0 min-w-0">
        <div class="space-y-3 mt-1">
          <MaintenanceAction title="Save World State">
            <Button
              variant="maintenance-success"
              onClick={handleSave}
              disabled={apiStatus() !== "connected"}
            >
              Trigger Auto-Save
            </Button>
          </MaintenanceAction>

          <MaintenanceAction title="Graceful Shutdown">
            <div class="flex flex-col space-y-2">
              <FormTextarea
                rows={3}
                disabled={apiStatus() !== "connected" || isShutdownTransmitting()}
                placeholder="Shutdown message..."
                value={shutdownMsg()}
                onInput={(e) => setShutdownMsg(e.currentTarget.value)}
              />
              <div class="flex space-x-2">
                <input
                  type="number"
                  disabled={apiStatus() !== "connected" || isShutdownTransmitting()}
                  placeholder="Sec"
                  value={shutdownSec()}
                  onInput={(e) => setShutdownSec(Number(e.currentTarget.value))}
                  class="w-16 bg-slate-950 border border-slate-800 rounded p-1 text-xs text-center text-slate-300 focus:outline-none focus:border-amber-500 disabled:opacity-30"
                />
                <Button
                  variant="maintenance-warning-inline"
                  onClick={handleGracefulShutdown}
                  disabled={
                    apiStatus() !== "connected" ||
                    isShutdownTransmitting() ||
                    !shutdownMsg().trim() ||
                    shutdownSec() == undefined
                  }
                >
                  Timed Stop
                </Button>
              </div>
            </div>
          </MaintenanceAction>

          <MaintenanceAction title="Force Stop">
            <Button
              variant="maintenance-danger"
              onClick={handleForceStop}
              disabled={apiStatus() !== "connected"}
            >
              Kill Process Immediately
            </Button>
          </MaintenanceAction>
        </div>
      </DashboardCard>
    </aside>
  );
}
