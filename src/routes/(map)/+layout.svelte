<script lang="ts">
	import { app } from '$lib/app.svelte';
	import { Loader } from '@googlemaps/js-api-loader';
	import { env } from '$env/dynamic/public';
	import { initMap } from '$lib/map';

	const { children } = $props<{children: ()=>any}>()

	$effect(() => {
		app.map = initMap();

		const loader = new Loader({
			apiKey: env.PUBLIC_GOOGLE_API_KEY,
			version: 'weekly'
		});
		loader.importLibrary('routes').then((routes) => (app.routesLibrary = routes));
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="grid grid-cols-app gap-y-8 text-white overflow-hidden">
	<div
		class:opacity-100={app.map}
		class="{app.map
			? 'opacity-100'
			: 'opacity-0 blur-xl grayscale'} background-map-bg transition duration-[2s] flex col-span-full row-span-full"
	>
		<div id="map" class="flex-1" />
	</div>
	<div bind:contentRect={app.sidebarRect} class="col-start-1 row-start-1 z-10 p-4">
		<div class="bg-gray-800 rounded-md">
			{@render children()}
		</div>
	</div>
</div>
