<script lang="ts">
	import { app } from '$lib/app.svelte';
	import { appKy } from '$lib/net';
	import type { Address, ListRide, Ride } from '$lib/ride';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	function zoomRide(ride: Ride) {
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
	}
	let ride = $state<Promise<Ride>>(appKy(`rides/${data.rideId}`).json<Ride>());
	$effect(() => {
		navigator.geolocation.getCurrentPosition(async (position) => {
			let rideWithTimes = await appKy(`rides/${data.rideId}`, {
				searchParams: { lat: position.coords.latitude, lon: position.coords.longitude }
			}).json<Ride>();
			ride = Promise.resolve(rideWithTimes);
		});
	});
	$effect(() => {
		ride.then(zoomRide);
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

	function formatDistance(distance: number) {
		return `${Math.round(distance / 1000)}km`;
	}
</script>

<div>
	{#await ride}
		<div class="p-4 text-xl font-bold">Loading ride</div>
	{:then ride}
		<div class="flex flex-col gap-2 p-4">
			<a href="/">Back</a>
			<h1 class="text-xl font-bold">{ride.name}</h1>
			<div class="grid grid-cols-route-list gap-4">
				<div class="font-bold text-white col-span-2">Distance</div>
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
			</div>
			<div class="text-gray-400 grid grid-cols-4">
				{#each ride.ways as way}
					<div>
						{way.place.localname}
					</div>
					<div>
						{way.place.extratags.surface}
					</div>
					<div>
						{formatDistance(way.distance)}
					</div>
					<div>
						{way.place.osm_id}
					</div>
				{/each}
			</div>
		</div>
	{:catch error}
		<div class="p-4 text-xl font-bold">
			Error: {error.message}
		</div>
	{/await}
</div>
