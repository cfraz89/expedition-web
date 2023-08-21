<script lang="ts">
	import { onMount } from 'svelte';
	import { appMap, sidebarRect } from '$lib/stores';
	import { Loader } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_API_KEY } from '$env/static/public';
	import { routesLibrary } from '$lib/stores';
	import { initMap } from '$lib/map';

	onMount(async () => {
		appMap.set(initMap());

		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_API_KEY,
			version: 'weekly'
		});
		loader.importLibrary('routes').then((routes) => routesLibrary.set(routes));
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="grid grid-cols-app gap-y-8 text-white">
	<div
		class:opacity-100={$appMap}
		class="{$appMap
			? 'opacity-100'
			: 'opacity-0 blur-xl grayscale'} background-map-bg transition duration-[2s] flex col-span-full row-span-full"
	>
		<div id="map" class="flex-1" />
	</div>
	<div bind:contentRect={$sidebarRect} class="col-start-1 row-start-1 z-10 p-4">
		<div class="bg-gray-800 rounded-md">
			<slot />
		</div>
	</div>
</div>
