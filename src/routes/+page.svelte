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

<div class="container">
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
					<span class="name">{ride.name}</span>
					<span class="distance">{Math.round(ride.total_distance / 1000)}km</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 17px;
	}
	.ride-list {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
	}

	.ride-list button {
		background: white;
		border: none;
		cursor: pointer;
		text-align: left;
		padding-top: 16px;
		padding-bottom: 16px;
		padding-left: 8px;
		padding-right: 8px;
		font-size: 16px;
		border-bottom: 1px solid #eee;
		display: flex;
		justify-content: space-between;
	}
	.ride-list button .name {
		color: #ee3333;
	}
	.ride-list button .distance {
		color: black;
	}
</style>
