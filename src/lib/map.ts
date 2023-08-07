import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
import mapboxgl from 'mapbox-gl';

export function initMap() {
	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/cfraz89/cll1453mk005e01pwe14gfrbd'
	});

	map.on('load', () => {
		map.addSource('selected_ride', {
			type: 'geojson',
			data: { type: 'FeatureCollection', features: [] }
		});
		map.addLayer({
			id: 'route',
			type: 'line',
			source: 'selected_ride',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#ff4444',
				'line-width': 4
			}
		});
	});

	//Center on sydney region
	map.flyTo({
		center: { lng: 151.2099, lat: -33.865143 },
		zoom: 9,
		pitch: 60,
		bearing: 0,
		animate: false
	});

	return map;
}
