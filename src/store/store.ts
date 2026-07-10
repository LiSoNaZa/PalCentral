import { createSignal } from "solid-js";
import { PalworldAPI, type PalworldGameDataResponse, type Player, type ServerCredentials, type ServerInfoData, type ServerMetrics, type ServerSettings } from "../api";

export type ApiStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

const emptyCreds: ServerCredentials = { ip: "", port: "8212", username: "", password: "" };

export const [credentials, setCredentials] = createSignal<ServerCredentials>(emptyCreds);
export const [apiStatus, setApiStatus] = createSignal<ApiStatus>('disconnected');
export const [isConnected, setIsConnected] = createSignal<boolean>(false);
export const [lastUpdated, setLastUpdated] = createSignal<string>("Never");

export const [serverInfoData, setServerInfoData] = createSignal<ServerInfoData | null>(null);
export const [metricsData, setMetricsData] = createSignal<ServerMetrics | null>(null);
export const [playersData, setPlayersData] = createSignal<Player[]>([]);
export const [serverSettingsData, setServerSettingsData] = createSignal<ServerSettings | null>(null);

export const [gameData, setGameData] = createSignal<PalworldGameDataResponse | null>(null);

let pollingInterval: number | null = null;

export const AppAuth = {
  loadFromStorage() {
    const saved = localStorage.getItem("palworld_creds");
    if (saved) {
      const creds = JSON.parse(saved);
      this.validateAndConnect(creds);
    }
  },

  async validateAndConnect(creds: ServerCredentials): Promise<boolean> {
    setApiStatus('connecting');
    setCredentials(creds);

    try {
      const info = await PalworldAPI.getInfo();
      
      setServerInfoData(info);
      localStorage.setItem("palworld_creds", JSON.stringify(creds));
      setApiStatus('connected');
      setIsConnected(true);

      this.fetchLiveSnapshot();
      this.startPolling();
      return true;
    } catch (e) {
      console.error(e);
      setCredentials(emptyCreds);
      setApiStatus('error');
      this.stopPolling();
      return false;
    }
  },

  async fetchLiveSnapshot() {
    if (!credentials().ip) return;

    try {
      const [newInfos, newMetrics, newPlayers, newSettings] = await Promise.all([
        PalworldAPI.getInfo(),
        PalworldAPI.getMetrics(),
        PalworldAPI.getPlayers(),
        PalworldAPI.getServerSettings()
      ]);

      setServerInfoData(newInfos);
      setMetricsData(newMetrics);
      setPlayersData(newPlayers);
      setServerSettingsData(newSettings);
      setLastUpdated(new Date().toLocaleTimeString());
      
      if (apiStatus() === 'error') setApiStatus('connected');
    } catch (e) {
      console.error("Polling failed:", e);
      setApiStatus('error');
    }
  },

  startPolling() {
    this.stopPolling();
    pollingInterval = window.setInterval(() => {
      this.fetchLiveSnapshot();
    }, 5000);
  },

  stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  disconnect() {
    this.stopPolling();
    setCredentials(emptyCreds);
    setServerInfoData(null);
    setMetricsData(null);
    setPlayersData([]);
    setServerSettingsData(null);
    setLastUpdated("Never");
    localStorage.removeItem("palworld_creds");
    setApiStatus('disconnected');
    setIsConnected(false);
  }
};

export const AppActions = {
  async broadcastMessage(message: string): Promise<boolean> {
    if (!message.trim() || apiStatus() !== 'connected') return false;
    
    try {
      await PalworldAPI.sendAnnouncement(message.trim());
      return true;
    } catch (e) {
      console.error("Announcement failed:", e);
      return false;
    }
  },

  async unbanPlayer(userId: string): Promise<boolean> {
    if (!userId.trim() || apiStatus() !== 'connected') return false;
    
    try {
      await PalworldAPI.unbanPlayer(userId.trim());
      return true;
    } catch (e) {
      console.error("Player Unban failed:", e);
      return false;
    }
  },

  async saveWorld(): Promise<boolean> {
    if (apiStatus() !== 'connected') return false;
    
    try {
      await PalworldAPI.saveWorld();
      return true;
    } catch (e) {
      console.error("World save failed:", e);
      return false;
    }
  },

  async shutdownServer(waitTime: number, message: string): Promise<boolean> {
    if (waitTime == undefined || !message.trim() || apiStatus() !== 'connected') return false;
    
    try {
      await PalworldAPI.shutdownWorld(waitTime, message);
      return true;
    } catch (e) {
      console.error("Server shutdown failed:", e);
      return false;
    }
  },

  async forceShutdownServer(): Promise<boolean> {
    if (apiStatus() !== 'connected') return false;
    
    try {
      await PalworldAPI.forceStopServer();
      return true;
    } catch (e) {
      console.error("World save failed:", e);
      return false;
    }
  },

  async kickPlayer(userId: string, message: string): Promise<boolean> {
    try {
      return await PalworldAPI.kickPlayer(userId, message);
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async banPlayer(userId: string, message: string): Promise<boolean> {
    try {
      return await PalworldAPI.banPlayer(userId, message);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};