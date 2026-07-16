import { appState } from "../store/store";
import type { PalworldGameDataResponse, Player, PlayerResponse, ServerInfoData, ServerMetrics, ServerSettings } from "./models";

const apiPrefix: string = '/v1/api';

const getBaseUrl = () => {
  const creds = appState.credentials;
  return `http://${creds.ip}:${creds.port}${apiPrefix}`;
};

const getAuthHeader = () => {
  const creds = appState.credentials;
  return `Basic ${btoa(`${creds.username}:${creds.password}`)}`;
};

export const PalworldAPI = {
  async getInfo(): Promise<ServerInfoData> {
    const res = await fetch(`${getBaseUrl()}/info`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Could not connect to server info');
    return res.json();
  },

  async getMetrics(): Promise<ServerMetrics> {
    const res = await fetch(`${getBaseUrl()}/metrics`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Error while loading metrics');
    return res.json();
  },

  async getPlayers(): Promise<PlayerResponse> {
    const res = await fetch(`${getBaseUrl()}/players`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Error while loading player list');
    return res.json();
  },

  async getServerSettings(): Promise<ServerSettings> {
    const res = await fetch(`${getBaseUrl()}/settings`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Error while loading server settings');
    return res.json();
  },

  async sendAnnouncement(message: string): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/announce`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!res.ok) throw new Error('Failed to send announcement');
    return res.ok;
  },

  async unbanPlayer(userId: string): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/unban`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userid: userId })
    });
    
    if (!res.ok) throw new Error('Failed to unban player');
    return res.ok;
  },

  async saveWorld(): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/save`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error('Failed to save world');
    return res.ok;
  },

  async shutdownWorld(waitTime: number, message: string): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/shutdown`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ waittime: waitTime, message })
    });
    
    if (!res.ok) throw new Error('Failed to shutdown server');
    return res.ok;
  },

  async forceStopServer(): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error('Failed to stop server');
    return res.ok;
  },

  async kickPlayer(userId: string, message: string): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/kick`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userid: userId, message })
    });
    if (!res.ok) throw new Error('Failed to kick player');
    return res.ok;
  },

  async banPlayer(userId: string, message: string): Promise<boolean> {
    const res = await fetch(`${getBaseUrl()}/ban`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userid: userId, message })
    });
    if (!res.ok) throw new Error('Failed to ban player');
    return res.ok;
  },

  async getGameData(): Promise<PalworldGameDataResponse> {
    const res = await fetch(`${getBaseUrl()}/game-data`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error('Failed to fetch game data');
    return res.json() as Promise<PalworldGameDataResponse>;
  }
};