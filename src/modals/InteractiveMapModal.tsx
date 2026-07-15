import { createEffect, onCleanup } from "solid-js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Player } from "../api";

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[]
}

export function InteractiveMapModal(props: InteractiveMapModalProps) {
  let mapContainer!: HTMLDivElement;
  let map: L.Map | null = null;
  let markerGroup: L.LayerGroup | null = null;

  const inGameToLatLng = (x: number, y: number): L.LatLngExpression => {
    const scale = 0.000256;
  
    const rawX = x * scale;
    const rawY = y * scale;
  
    const offsetX = 178.7;
    const offsetY = 134.0;
  
    const leafletX = offsetX + rawX;
    const leafletY = offsetY - rawY;
  
    return [leafletY, leafletX];
  };

  const destroyMap = () => {
    if (map) {
      map.remove();
      map = null;
      markerGroup = null;
    }
  };

  createEffect(() => {
    if (props.isOpen) {
      destroyMap();

      const palworldCRS = L.extend({}, L.CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0) 
      });
      const bounds = new L.LatLngBounds([0, 0], [256, 256]);

      // Map-Instanz initialisieren
      map = L.map(mapContainer, {
        crs: palworldCRS,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('/map_tiles/{z}/{x}/{y}.png', {
        bounds: bounds,
        noWrap: true,
        maxNativeZoom: 6,    
        minNativeZoom: 2,
        tms: false, 
      }).addTo(map);

      markerGroup = L.layerGroup().addTo(map);

      setTimeout(() => {
        if (map) {
          map.invalidateSize();
          map.setView([128, 128], 2);
          
          updateMarkers();
        }
      }, 310);

    } else {
      destroyMap();
    }
  });

  const updateMarkers = () => {
    if (!map || !markerGroup || !props.isOpen) return;

    markerGroup.clearLayers();

    props.players.forEach((player) => {
      const coords = inGameToLatLng(player.location_x, player.location_y);

      const playerIcon = L.divIcon({
        className: 'custom-player-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            <span class="absolute -top-6 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
              ${player.name}
            </span>
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.marker(coords, { icon: playerIcon })
        .addTo(markerGroup!)
        .bindPopup(`
          <div class="text-slate-100 font-sans p-1">
            <h4 class="font-bold border-b border-slate-700 pb-1 mb-1.5 text-sm flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              ${player.name}
            </h4>
            <div class="space-y-1 text-xs text-slate-300">
              <p><b class="text-slate-400">Level:</b> ${player.level}</p>
              <p><b class="text-slate-400">Coords:</b> X: ${player.location_x.toFixed(0)} | Y: ${player.location_y.toFixed(0)}</p>
            </div>
          </div>
        `, {
          className: 'custom-dark-popup', 
          minWidth: 160,
          closeButton: false,
        });
    });
  };

  createEffect(() => {
    updateMarkers();
  });

  onCleanup(() => {
    destroyMap();
  });

  return (
    <div 
      class={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        props.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div class="flex flex-col bg-slate-900 border border-slate-800 w-[85vw] max-w-[1920px] h-[85vw] max-h-[1080px] rounded-xl shadow-2xl overflow-hidden m-4 transform transition-all duration-300">
        
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

        <div class="flex justify-between items-center px-6 py-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/50">
          <span>Active Players: {props.players.length}</span>
          <span>Coordinates automatically sync from Live-API</span>
        </div>

      </div>
    </div>
  );
}