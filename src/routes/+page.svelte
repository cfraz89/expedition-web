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

	let rideMap: Map<string, Ride> = new Map();
	const getMap: () => mapboxgl.Map = getContext<() => mapboxgl.Map>('map');

	const onButtonClick = async (rideId: string) => {
		let ride = rideMap.get(rideId) ?? (await appKy(`rides/${rideId}`).json<Ride>());
		rideMap.set(rideId, ride);
		const map = getMap();
		(map.getSource('selected_ride') as GeoJSONSource).setData(ride.geo_json);
	};

	const zoomRide = async (rideId: string) => {
		let ride = rideMap.get(rideId) ?? (await appKy(`rides/${rideId}`).json<Ride>());
		rideMap.set(rideId, ride);
		const map = getMap();
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
				<button class="ride" on:click={() => onButtonClick(ride.id)}>
					<button on:click={() => zoomRide(ride.id)}>Zoom</button>
					<div class="name-distance">
						<span class="name">{ride.name}</span>
						<span class="distance">{Math.round(ride.total_distance / 1000)}km</span>
					</div>
					<div class="start-address">
						<div class="label">Start</div>
						<div>{ride.start_address?.formatted_address}</div>
					</div>
					<div class="end-address">
						<div class="label">End</div>
						<div>{ride.end_address?.formatted_address}</div>
					</div></button
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 17px;
		color: #333;
	}
	.ride-list {
		display: flex;
		flex-direction: column;
		margin-top: 16px;
	}

	.ride {
		color: #666;
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
		flex-direction: column;
		gap: 8px;
	}

	.name-distance {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.ride .name {
		font-weight: bold;
		color: #cc3333;
	}
	.ride .distance {
		color: #cc3333;
	}

	.ride .label {
		font-size: 12px;
		font-weight: bold;
		color: #ee3333;
	}

	.start-address,
	.end-address {
		display: flex;
		gap: 16px;
		align-items: center;
	}
</style>
