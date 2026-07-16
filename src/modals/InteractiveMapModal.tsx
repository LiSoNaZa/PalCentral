import { createEffect, createSignal, Index, onCleanup, Show } from "solid-js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Player } from "../api";
import type { BasePOI, FastTravelPoint, LoadPOIOptions, MarkerData } from "../map";

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[]
}

const FOLLOW_ZOOM = 6;

const getPlayerKey = (player: Player) => player.userId || player.playerId;

export function InteractiveMapModal(props: InteractiveMapModalProps) {
  let mapContainer!: HTMLDivElement;
  let followSelectRef: HTMLSelectElement | undefined;
  let map: L.Map | null = null;
  let playerGroup: L.LayerGroup | null = null;
  let fastTravelGroup: L.LayerGroup | null = null;
  let dungeonsGroup: L.LayerGroup | null = null;
  const playerMarkers = new Map<string, L.Marker>();
  const [mapReady, setMapReady] = createSignal(false);
  const [followedPlayerId, setFollowedPlayerId] = createSignal<string | null>(null);
  let ignoreSelectChange = false;

  const inGameToLatLng = (x: number, y: number): L.LatLngExpression => {
    const minX = -1099400.0;
    const maxX = 349400.0;
    const minY = -724400.0;
    
    const mapSize = 256.0;
    
    const cmPerPx = (maxX - minX) / mapSize;
  
    let pixelX = (y - minY) / cmPerPx;
    let pixelY = (x - minX) / cmPerPx;
  
    pixelY = mapSize - pixelY;
  
    return [pixelY, pixelX]; 
  };

  const destroyMap = (clearFollow = false) => {
    if (map) {
      map.remove();
      map = null;
      playerGroup = null;
      fastTravelGroup = null;
      dungeonsGroup = null;
    }
    playerMarkers.clear();
    setMapReady(false);
    if (clearFollow) setFollowedPlayerId(null);
  };

  const centerOnPlayer = (player: Player, animate = true) => {
    if (!map) return;
    const coords = inGameToLatLng(player.location_x, player.location_y);
    map.setView(coords, FOLLOW_ZOOM, { animate });
  };

  const followPlayer = (playerId: string) => {
    setFollowedPlayerId(playerId);
    map?.closePopup();
  };

  const stopFollowing = () => {
    setFollowedPlayerId(null);
  };

  const toggleFollowPlayer = (playerId: string) => {
    setFollowedPlayerId((current) => {
      if (current === playerId) return null;
      map?.closePopup();
      return playerId;
    });
  };

  createEffect(() => {
    if (props.isOpen) {
      destroyMap();

      const palworldCRS = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0) 
      });
      const bounds = new L.LatLngBounds([0, 0], [256, 256]);

      map = L.map(mapContainer, {
        crs: palworldCRS,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('map_tiles/{z}/{x}/{y}.png', {
        bounds: bounds,
        noWrap: true,
        maxNativeZoom: 6,    
        minNativeZoom: 2,
        tms: false, 
      }).addTo(map);

      playerGroup = L.layerGroup().addTo(map);
      fastTravelGroup = L.layerGroup().addTo(map);
      dungeonsGroup = L.layerGroup().addTo(map);

      setTimeout(() => {
        if (map) {
          map.invalidateSize();
          map.setView([128, 128], 2);
          
          loadFastTravelPoints();
          loadDungeons();
          setMapReady(true);
        }
      }, 310);

    } else {
      destroyMap(true);
    }
  });
  
  const addMarkerToGroup = (group: L.LayerGroup, data: MarkerData, onPopupOpen?: (popup: L.Popup) => void) => {
    const marker = L.marker(data.coords, { icon: data.icon });

    if (data.popupHtml && data.popupHtml.trim() !== '') {
      marker.bindPopup(data.popupHtml, {
        className: data.popupClass || 'custom-dark-popup',
        minWidth: data.popupWidth || 160,
        closeButton: false,
      });

      if (onPopupOpen) {
        marker.on('popupopen', (e) => onPopupOpen(e.popup));
      }
    }

    marker.addTo(group);
    return marker;
  };

  const buildPlayerIcon = (player: Player, isFollowing: boolean) =>
    L.divIcon({
      className: 'custom-player-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full ${isFollowing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 ${isFollowing ? 'bg-amber-500' : 'bg-emerald-500'} border border-white"></span>
          <span class="absolute -top-6 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
            ${player.name}
          </span>
        </div>
      `,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

  const buildPlayerPopupHtml = (player: Player, isFollowing: boolean) => `
    <div class="text-slate-100 font-sans p-1">
      <h4 class="font-bold border-b border-slate-700 pb-1 mb-1.5 text-sm flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full ${isFollowing ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
        ${player.name}
      </h4>
      <div class="space-y-1 text-xs text-slate-300 mb-2">
        <p><b class="text-slate-400">Level:</b> ${player.level}</p>
        <p><b class="text-slate-400">Coords:</b> X: ${player.location_x.toFixed(0)} | Y: ${player.location_y.toFixed(0)}</p>
      </div>
      <button
        type="button"
        class="follow-player-btn w-full mt-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition ${
          isFollowing
            ? 'bg-amber-600 hover:bg-amber-500 text-white'
            : 'bg-emerald-700 hover:bg-emerald-600 text-white'
        }"
        data-player-id="${getPlayerKey(player)}"
      >
        ${isFollowing ? 'Stop following' : 'Follow player'}
      </button>
    </div>
  `;

  const bindFollowButton = (popup: L.Popup, playerKey: string) => {
    const btn = popup.getElement()?.querySelector<HTMLButtonElement>('.follow-player-btn');
    if (!btn) return;

    btn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFollowPlayer(playerKey);
    };
  };
  
  const loadPlayerMarker = (players: Player[], followId: string | null) => {
    if (!map || !playerGroup) return;

    const activeIds = new Set<string>();

    players.forEach((player) => {
      const playerKey = getPlayerKey(player);
      const coords = inGameToLatLng(player.location_x, player.location_y);
      const isFollowing = followId === playerKey;
      const icon = buildPlayerIcon(player, isFollowing);
      const popupHtml = buildPlayerPopupHtml(player, isFollowing);
      activeIds.add(playerKey);

      const existing = playerMarkers.get(playerKey);
      if (existing) {
        existing.setLatLng(coords);
        existing.setIcon(icon);
        existing.setPopupContent(popupHtml);
        const popup = existing.getPopup();
        if (popup?.isOpen()) {
          bindFollowButton(popup, playerKey);
        }
        return;
      }

      const marker = addMarkerToGroup(
        playerGroup!,
        {
          coords,
          icon,
          popupClass: 'custom-dark-popup',
          popupWidth: 180,
          popupHtml,
        },
        (popup) => bindFollowButton(popup, playerKey)
      );

      playerMarkers.set(playerKey, marker);
    });

    for (const [playerKey, marker] of playerMarkers) {
      if (activeIds.has(playerKey)) continue;
      playerGroup.removeLayer(marker);
      playerMarkers.delete(playerKey);
    }
  };

  const loadStaticPOIs = async <T extends BasePOI>(options: LoadPOIOptions) => {
    if (!map || !options.group) return;
  
    try {
      const response = await fetch(options.url);
      if (!response.ok) throw new Error(options.errorMsg);
      
      const data: Record<string, T> = await response.json();
      const points = Object.values(data);
  
      const size = options.iconSize || [30, 30];
      const poiIcon = L.icon({
        iconUrl: options.iconUrl,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2],
        popupAnchor: [0, -(size[1] / 2)]
      });
  
      const markers: L.Marker[] = [];
  
      points.forEach((point) => {
        const coords = inGameToLatLng(point.x, point.y);
        const popupHtml = options.createPopupHtml ? options.createPopupHtml(point) : undefined;
  
        const marker = L.marker(coords, { icon: poiIcon });
        
        if (popupHtml && popupHtml.trim() !== '') {
          marker.bindPopup(popupHtml, {
            className: 'custom-dark-popup',
            minWidth: 200,
            closeButton: false,
          });
        }
  
        markers.push(marker);
      });
  
      const updateVisibility = () => {
        const currentZoom = map.getZoom();
        const shouldBeVisible = options.minZoom === undefined || currentZoom >= options.minZoom;
  
        if (shouldBeVisible) {
          markers.forEach(marker => {
            if (!options.group!.hasLayer(marker)) {
              marker.addTo(options.group!);
            }
          });
        } else {
          markers.forEach(marker => {
            if (options.group!.hasLayer(marker)) {
              options.group!.removeLayer(marker);
            }
          });
        }
      };
  
      updateVisibility();
      map.on('zoomend', updateVisibility);
  
    } catch (error) {
      console.error(options.errorMsg, error);
    }
  };

  const loadFastTravelPoints = () => {
    return loadStaticPOIs<FastTravelPoint>({
      url: 'data/json/fast_travel_points.json',
      group: fastTravelGroup,
      iconUrl: 'images/map/fast_travel.webp',
      errorMsg: "Can't load fast travel points",
      minZoom: 3,
      createPopupHtml: (point) => `
        <div class="text-slate-100 font-sans p-1">
          <h4 class="font-bold border-b border-slate-700 pb-1 mb-1.5 text-sm flex items-center gap-2">
            <img src="images/map/fast_travel.webp" class="h-4 w-4" />
            ${point.localized_name}
          </h4>
          <div class="space-y-1 text-xs text-slate-300">
            <p><b class="text-slate-400">ID:</b> ${point.id}</p>
            <p><b class="text-slate-400">Ingame-Coords:</b> X: ${Math.round(point.x / 1000)} | Y: ${Math.round(point.y / 1000)}</p>
          </div>
        </div>
      `
    });
  };

  const loadDungeons = () => {
    return loadStaticPOIs<FastTravelPoint>({
      url: 'data/json/dungeons.json',
      group: dungeonsGroup,
      iconUrl: 'images/map/dungeon.webp',
      errorMsg: "Can't load dungeons",
      minZoom: 4
    });
  };

  createEffect(() => {
    // Always track players first — early returns must not skip this,
    // otherwise Solid never re-runs when the store updates every 5s.
    const players = props.players.map((player) => ({
      name: player.name,
      userId: player.userId,
      accountName: player.accountName,
      playerId: player.playerId,
      iP: player.iP,
      ping: player.ping,
      location_x: player.location_x,
      location_y: player.location_y,
      level: player.level,
      building_count: player.building_count,
    }));
    const followId = followedPlayerId();

    if (!props.isOpen || !mapReady()) return;

    loadPlayerMarker(players, followId);

    if (followId) {
      const followed = players.find((player) => getPlayerKey(player) === followId);
      if (followed) {
        centerOnPlayer(followed);
      } else if (players.length > 0) {
        // Only clear when the player really left — never on empty/transient updates.
        setFollowedPlayerId(null);
      }
    }

    // Keep native <select> in sync after option nodes refresh on each poll.
    ignoreSelectChange = true;
    queueMicrotask(() => {
      if (followSelectRef) {
        followSelectRef.value = followedPlayerId() ?? "";
      }
      ignoreSelectChange = false;
    });
  });

  onCleanup(() => {
    destroyMap(true);
  });

  const followedPlayer = () =>
    props.players.find((player) => getPlayerKey(player) === followedPlayerId()) ?? null;

  return (
    <div 
      class={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        props.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={props.onClose}
    >
      <div class="flex flex-col bg-slate-900 border border-slate-800 w-[85vw] max-w-[1920px] h-[85vh] max-h-[1080px] rounded-xl shadow-2xl overflow-hidden m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 class="text-lg font-bold text-slate-100">Live Server Map</h3>
          </div>
          <button 
            onClick={props.onClose}
            class="text-slate-400 hover:text-slate-100 transition-colors text-2xl font-semibold leading-none"
          >
            &times;
          </button>
        </div>

        <div class="p-1 bg-slate-950 flex-1">
          <div 
            ref={mapContainer} 
            class="w-full h-full rounded-lg overflow-hidden" 
            style="background-color: #0d1117;"
          />
        </div>

        <div class="flex flex-wrap justify-between items-center gap-3 px-6 py-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/50">
          <div class="flex flex-wrap items-center gap-4 min-h-[28px]">
            <span class="leading-none flex items-center h-7">
              Active Players: {props.players.length}
            </span>

            <div class="flex items-center gap-2 h-7">
              <span class="text-slate-500 uppercase tracking-wider text-[10px] font-semibold leading-none">
                Follow
              </span>
              <select
                ref={followSelectRef}
                class="h-7 bg-slate-950 border border-slate-700 rounded-md px-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                value={followedPlayerId() ?? ""}
                disabled={props.players.length === 0}
                onChange={(e) => {
                  if (ignoreSelectChange) return;
                  const value = e.currentTarget.value;
                  if (value) followPlayer(value);
                  else stopFollowing();
                }}
              >
                <option value="">None</option>
                <Index each={props.players}>
                  {(player) => (
                    <option value={getPlayerKey(player())}>
                      {player().name}
                    </option>
                  )}
                </Index>
              </select>

              <Show when={followedPlayerId()}>
                <button
                  type="button"
                  onClick={stopFollowing}
                  class="h-7 w-7 flex items-center justify-center rounded-md border border-slate-700 bg-slate-950 hover:bg-slate-800 hover:border-slate-500 text-slate-300 text-base leading-none transition"
                  title="Stop following"
                  aria-label="Stop following"
                >
                  &times;
                </button>
              </Show>

              <Show when={followedPlayer()}>
                {(player) => (
                  <span class="inline-flex items-center gap-1.5 text-amber-400 leading-none h-7">
                    <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Tracking {player().name}
                  </span>
                )}
              </Show>
            </div>
          </div>
          <span class="leading-none flex items-center h-7">Coordinates automatically sync from Live-API</span>
        </div>

      </div>
    </div>
  );
}
