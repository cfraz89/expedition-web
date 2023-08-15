<script lang="ts">
	import { appMap, sidebarRect } from '$lib/map';
	import { appKy } from '$lib/net';
	import type { ListRide, Ride } from '$lib/types';
	import { createQuery } from '@tanstack/svelte-query';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
	import { derived, writable } from 'svelte/store';

	const rides = createQuery({
		queryKey: ['rides'],
		queryFn: () => appKy('rides').json<ListRide[]>()
	});

	let selectedRideId = writable<string>();

	const selectedRide = createQuery(
		derived(selectedRideId, ($id) => ({
			queryKey: ['ride', $id],
			queryFn: () => appKy(`rides/${$id}`).json<Ride>(),
			enabled: $id != null
		}))
	);
	$: if ($selectedRide.data) {
		($appMap.getSource('selected_ride') as GeoJSONSource).setData($selectedRide.data.geo_json);
		let { bbox } = $selectedRide.data.geo_json;
		if (bbox) {
			let bounds = $appMap.cameraForBounds(bbox as LngLatBoundsLike, {
				padding: { bottom: 80, right: 80, top: 80, left: 80 + $sidebarRect.right },
				pitch: 60
			});
			if (bounds) {
				$appMap.flyTo(bounds);
			}
		}
	}

	function formatAddress(address: google.maps.GeocoderAddressComponent[]) {
		const end = address.findIndex((c) => c.types.find((t) => t === 'country') != null);
		return address
			.slice(0, end)
			.reduceRight(
				(addr: string | undefined, c) =>
					addr
						? c.types.includes('street_number')
							? `${c.short_name} ${addr}`
							: `${c.short_name}, ${addr}`
						: c.short_name,
				undefined
			);
	}
</script>

<div>
	{#if $rides.isLoading}
		<div>Loading rides</div>
	{:else if $rides.isError}
		<div>Error: {$rides.error.message}</div>
	{:else if $rides.isSuccess}
		<div class="flex flex-col gap-2">
			<h1 class="bg-gray-800 p-4 text-xl font-bold rounded-md">Rides</h1>
			{#each $rides.data as ride}
				<button
					class="bg-gray-800 rounded-md p-4 flex flex-col gap-2 text-start"
					on:click={() => {
						selectedRideId.set(ride.id);
					}}
					class:bg-slate-500={$selectedRideId === ride.id}
				>
					<div class="flex justify-between mb-2">
						<span class="text-lg font-bold text-orange-300">{ride.name}</span>
						<span class="font-bold text-orange-300">{Math.round(ride.total_distance / 1000)}km</span
						>
					</div>
					<div class="grid [grid-template-columns:4em_1fr]">
						<div class="bold text-gray-300">Start</div>
						<div>{ride.start_address ? formatAddress(ride.start_address) : 'N/A'}</div>
					</div>
					<div class="grid [grid-template-columns:4em_1fr]">
						<div class="bold text-gray-300">End</div>
						<div>{ride.end_address ? formatAddress(ride.end_address) : 'N/A'}</div>
					</div></button
				>
			{/each}
		</div>
	{/if}
</div>
