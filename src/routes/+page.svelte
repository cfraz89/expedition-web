<script lang="ts">
	import { appKy } from '$lib/net';
	import type { ListRide, Ride } from '$lib/types';
	import { createQuery } from '@tanstack/svelte-query';
	import ky from 'ky';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
	import { getContext } from 'svelte';

	const rides = createQuery({
		queryKey: ['rides'],
		queryFn: () => appKy('rides').json<ListRide[]>()
	});

	const getMap: () => mapboxgl.Map = getContext<() => mapboxgl.Map>('map');

	const onButtonClick = async (rideId: string) => {
		const ride = await appKy(`rides/${rideId}`).json<Ride>();
		const map = getMap();
		(map.getSource('selected_ride') as GeoJSONSource).setData(ride.geo_json);
		let { bbox } = ride.geo_json;
		if (bbox) {
			let bounds = map.cameraForBounds(bbox as LngLatBoundsLike, { padding: 80, pitch: 60 });
			if (bounds) {
				map.flyTo(bounds);
			}
		}
	};
</script>

<div>
	<h1>Expedition</h1>
	<h3>ADV Maps Australia</h3>
	{#if $rides.isLoading}
		<div>Loading rides</div>
	{:else if $rides.isError}
		<div>Error: {$rides.error.message}</div>
	{:else if $rides.isSuccess}
		<div class="ride-list">
			{#each $rides.data as ride}
				<button on:click={() => onButtonClick(ride.id)}>
					{ride.name}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.ride-list {
		display: flex;
		flex-direction: column;
	}

	.ride-list button {
		background: white;
		color: black;
		border: none;
		cursor: pointer;
		text-align: left;
		padding: 16px;
		font-size: 16px;
		border-bottom: 1px solid #eee;
		color: #ee3333;
	}
</style>
