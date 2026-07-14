import type { DataListItem } from "../components/DataList";
import { apiStatus, metricsData, serverInfoData, serverSettingsData } from "../store/store";

export function formatServerInfo(): DataListItem[] {
  const info = serverInfoData();
  if (!info || apiStatus() === "error") {
    return [{ label: "Status", value: "No data available", colorClass: "text-rose-400" }];
  }

  return [
    { label: "Server Name", value: info.servername, colorClass: "text-blue-400 font-sans" },
    { label: "Version", value: info.version },
    { label: "World GUID", value: info.worldguid, colorClass: 'text-[11px]', type: 'newLine' },
    { label: "Description", value: info.description, colorClass: "font-sans text-[11px]", type: 'newLine' },
  ];
}

export function formatMetrics(): DataListItem[] {
  const data = metricsData();
  if (!data || apiStatus() === "error") {
    return [{ label: "Status", value: "Connection offline", colorClass: "text-rose-400" }];
  }

  const formatUptime = (sec: number) =>
    `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;

  return [
    {
      label: "Server FPS",
      value: `${data.serverfps} FPS`,
      colorClass: data.serverfps > 50 ? "text-emerald-400" : "text-amber-400",
    },
    { label: "Frame Time", value: `${data.serverframetime.toFixed(2)} ms` },
    {
      label: "Players",
      value: `${data.currentplayernum} / ${data.maxplayernum}`,
      colorClass: "text-blue-400",
    },
    { label: "In-Game Days", value: `Day ${data.days}` },
    { label: "Base Camps", value: data.basecampnum },
    { label: "Uptime", value: formatUptime(data.uptime) },
  ];
}

export function previewSettings(): DataListItem[] {
  const settings = serverSettingsData();
  if (!settings || apiStatus() === "error") return [];
  return Object.entries(settings).map(([key, value]) => ({
    label: key,
    value: String(value),
  }));
}
