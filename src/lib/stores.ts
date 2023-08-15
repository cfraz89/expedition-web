import { writable } from 'svelte/store';

export const appMap = writable<mapboxgl.Map>();
export const sidebarRect = writable<DOMRectReadOnly>();
export const routesLibrary = writable<google.maps.RoutesLibrary>();
