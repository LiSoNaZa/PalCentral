import { createStore } from "solid-js/store";
import { PalworldAPI, type PalworldGameDataResponse, type Player, type ServerCredentials, type ServerInfoData, type ServerMetrics, type ServerSettings } from "../api";

export type ApiStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

const emptyCreds: ServerCredentials = { ip: "", port: "8212", username: "", password: "" };

interface AppState {
  credentials: ServerCredentials;
  apiStatus: ApiStatus;
  isConnected: boolean;
  lastUpdated: string;
  serverInfoData: ServerInfoData | null;
  metricsData: ServerMetrics | null;
  playersData: Player[];
  serverSettingsData: ServerSettings | null;
  gameData: PalworldGameDataResponse | null;
}

export const [appState, setAppState] = createStore<AppState>({
  credentials: emptyCreds,
  apiStatus: 'disconnected',
  isConnected: false,
  lastUpdated: "Never",
  serverInfoData: null,
  metricsData: null,
  playersData: [],
  serverSettingsData: null,
  gameData: null,
});

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
    setAppState("apiStatus", 'connecting');
    setAppState("credentials", creds);

    try {
      const info = await PalworldAPI.getInfo();
      
      setAppState("serverInfoData", info);
      localStorage.setItem("palworld_creds", JSON.stringify(creds));
      setAppState({
        apiStatus: 'connected',
        isConnected: true,
      });

      this.fetchLiveSnapshot();
      this.startPolling();
      return true;
    } catch (e) {
      console.error(e);
      setAppState({
        credentials: emptyCreds,
        apiStatus: 'error',
      });
      this.stopPolling();
      return false;
    }
  },

  async fetchLiveSnapshot() {
    if (!appState.credentials.ip) return;

    try {
      const [newInfos, newMetrics, newPlayers, newSettings] = await Promise.all([
        PalworldAPI.getInfo(),
        PalworldAPI.getMetrics(),
        PalworldAPI.getPlayers(),
        PalworldAPI.getServerSettings()
      ]);

      setAppState({
        serverInfoData: newInfos,
        metricsData: newMetrics,
        playersData: newPlayers?.players || [],
        serverSettingsData: newSettings,
        lastUpdated: new Date().toLocaleTimeString(),
      });
      
      if (appState.apiStatus === 'error') setAppState("apiStatus", 'connected');
    } catch (e) {
      console.error("Polling failed:", e);
      setAppState("apiStatus", 'error');
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
    setAppState({
      credentials: emptyCreds,
      serverInfoData: null,
      metricsData: null,
      playersData: [],
      serverSettingsData: null,
      lastUpdated: "Never",
      apiStatus: 'disconnected',
      isConnected: false,
    });
    localStorage.removeItem("palworld_creds");
  }
};

export const AppActions = {
  async broadcastMessage(message: string): Promise<boolean> {
    if (!message.trim() || appState.apiStatus !== 'connected') return false;
    
    try {
      await PalworldAPI.sendAnnouncement(message.trim());
      return true;
    } catch (e) {
      console.error("Announcement failed:", e);
      return false;
    }
  },

  async unbanPlayer(userId: string): Promise<boolean> {
    if (!userId.trim() || appState.apiStatus !== 'connected') return false;
    
    try {
      await PalworldAPI.unbanPlayer(userId.trim());
      return true;
    } catch (e) {
      console.error("Player Unban failed:", e);
      return false;
    }
  },

  async saveWorld(): Promise<boolean> {
    if (appState.apiStatus !== 'connected') return false;
    
    try {
      await PalworldAPI.saveWorld();
      return true;
    } catch (e) {
      console.error("World save failed:", e);
      return false;
    }
  },

  async shutdownServer(waitTime: number, message: string): Promise<boolean> {
    if (waitTime == undefined || !message.trim() || appState.apiStatus !== 'connected') return false;
    
    try {
      await PalworldAPI.shutdownWorld(waitTime, message);
      return true;
    } catch (e) {
      console.error("Server shutdown failed:", e);
      return false;
    }
  },

  async forceShutdownServer(): Promise<boolean> {
    if (appState.apiStatus !== 'connected') return false;
    
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
