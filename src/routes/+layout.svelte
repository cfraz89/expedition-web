<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { initMap, appMap } from '$lib/map';
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	onMount(() => {
		appMap.set(initMap());
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
		<div id="map" class:loading={$appMap == null} class:loaded={$appMap != null} />
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
		background: #87f0ff;
		transition: all 2s;
	}

	.loading {
		filter: blur(20px) grayscale(1);
		opacity: 0;
	}

	.loaded {
		opacity: 1;
	}

	#view {
		grid-column: 1;
		background: white;
	}
</style>
