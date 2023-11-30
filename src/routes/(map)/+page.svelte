<script lang="ts">
	import { app } from '$lib/app.svelte';
	import { appKy } from '$lib/net';
	import type { Address, ListRide, Ride } from '$lib/ride';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';

	let rides = $state<Promise<ListRide[]>>(appKy('rides').json<ListRide[]>());
	$effect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			rides = appKy('rides', {
				searchParams: { lat: position.coords.latitude, lon: position.coords.longitude }
			}).json<ListRide[]>();
		});
	});

	class SelectedRide {
		id = $state<string>();
	}
	let selectedRide = new SelectedRide();
	$effect(() => {
		if (selectedRide.id) {
			appKy(`rides/${selectedRide.id}`)
				.json<Ride>()
				.then((ride) => {
					if (!app.map || !app.sidebarRect) {
						return;
					}
					(app.map.getSource('selected_ride') as GeoJSONSource).setData(ride.geo_json);
					let { bbox } = ride.geo_json;
					if (bbox) {
						let bounds = app.map.cameraForBounds(bbox as LngLatBoundsLike, {
							padding: { bottom: 80, right: 80, top: 80, left: 80 + app.sidebarRect.right },
							pitch: 30
						});
						if (bounds) {
							app.map.flyTo(bounds);
						}
					}
				});
		}
	});

	function formatAddress(address: Address) {
		return [
			address.tourism,
			address.road,
			address.suburb,
			address.city,
			address.state,
			address.postcode
		]
			.filter((a) => a != null)
			.join(', ');
	}

	function formatTime(t: number) {
		const hours = Math.floor(t / 3600);
		const minutes = Math.floor((t - hours * 3600) / 60);
		const seconds = Math.floor(t - hours * 3600 - minutes * 60);
		return `${hours}h ${minutes}m ${seconds}s`;
	}
</script>

<div>
	{#await rides}
		<div class="p-4 text-xl font-bold">Loading rides</div>
	{:then rides}
		<div class="flex flex-col gap-2">
			<h1 class="p-4 text-xl font-bold">Rides</h1>
			{#each rides as ride}
				{@const selected = selectedRide.id === ride.id}
				<button
					class="rounded-md p-4 flex flex-col gap-2 text-start"
					on:click={() => {
						selectedRide.id = ride.id;
					}}
					class:bg-slate-600={selected}
					class:bg-slate-800={!selected}
				>
					<div class="grid grid-cols-route-list gap-4">
						<div class="text-lg font-bold text-brand col-span-2">{ride.name}</div>
						<div class="font-bold text-brand">
							{Math.round(ride.total_distance / 1000)}km
						</div>
						<div class="font-bold text-white">Start</div>
						<div>
							{@html ride.start_address ? formatAddress(ride.start_address) : 'N/A'}
						</div>
						<div class="text-gray-400">
							{ride.time_from_origin_to_start ? formatTime(ride.time_from_origin_to_start) : ''}
						</div>
						<div class="font-bold text-white">End</div>
						<div>
							{@html ride.end_address ? formatAddress(ride.end_address) : 'N/A'}
						</div>
						<div class="text-gray-400">
							{ride.time_from_end_to_origin ? formatTime(ride.time_from_end_to_origin) : ''}
						</div>
					</div></button
				>
			{/each}
		</div>
	{:catch error}
		<div class="p-4 text-xl font-bold">
			Error: {error.message}
		</div>
	{/await}
</div>
