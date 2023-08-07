<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { initMap } from '$lib/map';
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	let map: mapboxgl.Map | undefined;
	setContext('map', () => map);

	onMount(() => {
		map = initMap();
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
	<style>
		body {
			margin: 0;
			padding: 0;
			font-family: sans;
		}

		h1,
		h2,
		h3 {
			margin: 0;
		}
	</style>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div id="page">
		<div id="view">
			<slot />
		</div>
		<div id="map" />
	</div>
</QueryClientProvider>

<style>
	#page {
		margin: 0;
		padding: 0;
		height: 100vh;
		display: grid;
		grid-template-columns: 400px 1fr;
		grid-template-rows: 1fr;
	}
	#map {
		grid-column: 2;
	}

	#view {
		grid-column: 1;
		background: white;
	}
</style>
