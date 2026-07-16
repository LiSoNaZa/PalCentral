import L from 'leaflet';

export interface BasePOI {
  x: number;
  y: number;
  [key: string]: any;
}

export interface LoadPOIOptions {
  url: string;
  group: L.LayerGroup | null;
  iconUrl: string;
  iconSize?: [number, number];
  errorMsg: string;
  minZoom?: number;
  createPopupHtml?: (point: any) => string;
}

export interface FastTravelPoint extends BasePOI {
  class: string;
  z: number;
  localized_name: string;
  id: string;
}

export interface Dungeon extends BasePOI {}

export interface MarkerData {
  coords: L.LatLngExpression;
  icon: L.Icon | L.DivIcon;
  popupClass?: string;
  popupWidth?: number;
  popupHtml?: string;
}