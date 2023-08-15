<script lang="ts">
	import '../app.css';
	import { onMount, setContext } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { initMap, appMap, sidebarRect } from '$lib/map';
	import logo from '$lib/assets/logo.webp';

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
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="h-screen grid grid-cols-app grid-rows-app gap-y-8 text-white">
		<div
			class={`${
				$appMap ? 'opacity-100' : 'opacity-0 blur-xl grayscale'
			} background-map-bg transition duration-[2s] flex col-span-full row-span-full`}
		>
			<div id="map" class="flex-1" />
		</div>
		<div class="col-start-1 row-start-1 z-10 p-4">
			<img src={logo} alt="logo" class="p-4 w-80 h-auto bg-gray-800 rounded-md bg-opacity-80" />
		</div>
		<div bind:contentRect={$sidebarRect} class="col-start-1 row-start-2 z-10 p-4">
			<slot />
		</div>
	</div>
</QueryClientProvider>
