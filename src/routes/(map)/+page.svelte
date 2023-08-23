<script lang="ts">
	import { appMap, routesLibrary, sidebarRect } from '$lib/stores';
	import { appKy } from '$lib/net';
	import type { ListRide, Ride } from '$lib/ride';
	import { createQuery } from '@tanstack/svelte-query';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
	import { derived, writable } from 'svelte/store';

	const rides = createQuery({
		queryKey: ['rides'],
		queryFn: () => appKy('rides').json<ListRide[]>()
	});

	const ridesWithTimings = createQuery(
		derived([rides, routesLibrary], ([$rides, $routesLibrary]) => ({
			queryKey: ['ridesWithTimings'],
			queryFn: () =>
				new $routesLibrary.DistanceMatrixService()
					.getDistanceMatrix({
						origins: [{ lng: 151.2099, lat: -33.865143 }],
						destinations: $rides.data!.map((r) => ({ lng: r.start_point.x, lat: r.start_point.y })),
						travelMode: google.maps.TravelMode.DRIVING
					})
					.then((matrix) =>
						$rides.data!.map((ride, i) => {
							const element = matrix.rows[0].elements[i];
							return {
								...ride,
								distanceFromUser: element.distance.text,
								timeFromUser: element.duration.text
							};
						})
					),
			enabled: $routesLibrary != null && $rides.isSuccess
		}))
	);

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
	{#if $rides.isLoading || $ridesWithTimings.isLoading}
		<div class="p-4 text-xl font-bold">Loading rides</div>
	{:else if $rides.isError || $ridesWithTimings.isError}
		<div class="p-4 text-xl font-bold">
			Error: {$rides.error?.message ?? $ridesWithTimings.error?.message}
		</div>
	{:else if $ridesWithTimings.isSuccess}
		<div class="flex flex-col gap-2">
			<h1 class="p-4 text-xl font-bold">Rides</h1>
			{#each $ridesWithTimings.data as ride}
				{@const selected = $selectedRideId === ride.id}
				<button
					class="rounded-md p-4 flex flex-col gap-2 text-start"
					on:click={() => {
						selectedRideId.set(ride.id);
					}}
					class:bg-slate-600={selected}
					class:bg-slate-800={!selected}
				>
					<div class="flex justify-between mb-2">
						<span class="text-lg font-bold text-brand">{ride.name}</span>
						<span class="font-bold text-brand">{Math.round(ride.total_distance / 1000)}km</span>
					</div>
					<div class="grid grid-cols-route-list gap-4">
						<div class="bold text-gray-300">Start</div>
						<div>{ride.start_address ? formatAddress(ride.start_address) : 'N/A'}</div>
						<div class="bold text-gray-300">End</div>
						<div>{ride.end_address ? formatAddress(ride.end_address) : 'N/A'}</div>
						<div class="bold text-gray-300">Distance to start</div>
						<div>{ride.distanceFromUser}</div>
						<div class="bold text-gray-300">Time to start</div>
						<div>{ride.timeFromUser}</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
