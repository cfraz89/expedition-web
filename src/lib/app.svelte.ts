export class App {
	map = $state<mapboxgl.Map>();
	sidebarRect = $state<DOMRectReadOnly>();
	routesLibrary = $state<google.maps.RoutesLibrary>();
}

export const app = new App();
