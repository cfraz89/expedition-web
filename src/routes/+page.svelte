<script lang="ts">
	import { appMap } from '$lib/map';
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
				padding: 80,
				pitch: 60
			});
			if (bounds) {
				$appMap.flyTo(bounds);
			}
		}
	}

	function formatAddress(address: google.maps.GeocoderAddressComponent[]) {
		const end = address.findIndex(
			(c) => c.types.find((t) => t.startsWith('administrative_area') || t === 'country') != null
		);
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
				<button
					class="ride"
					on:click={() => {
						selectedRideId.set(ride.id);
					}}
					class:selected={$selectedRideId === ride.id}
				>
					<div class="name-distance">
						<span class="name">{ride.name}</span>
						<span class="distance">{Math.round(ride.total_distance / 1000)}km</span>
					</div>
					<div class="start">
						<div class="label">Start</div>
						<div>{ride.start_address ? formatAddress(ride.start_address) : 'N/A'}</div>
					</div>
					<div class="end">
						<div class="label">End</div>
						<div>{ride.end_address ? formatAddress(ride.end_address) : 'N/A'}</div>
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

	.ride.selected {
		background: #aaaaee;
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

	.start,
	.end {
		display: flex;
		gap: 16px;
		align-items: center;
	}
</style>
