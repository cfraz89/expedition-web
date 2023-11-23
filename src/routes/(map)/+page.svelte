<script lang="ts">
	import { app } from '$lib/app.svelte';
	import { appKy } from '$lib/net';
	import type { ListRide, Ride } from '$lib/ride';
	import type { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';

	type Distance = { distanceFromUser: string; timeFromUser: string };
	type RideWithDistances = ListRide & {
		startDistance: Distance;
		endDistance: Distance;
	};
	async function getRides(): Promise<RideWithDistances[]> {
		const rides = await appKy('rides').json<ListRide[]>();
		if (!app.routesLibrary) {
			return new Promise(() => {});
		}
		try {
			const distanceMatrixService = new app.routesLibrary.DistanceMatrixService();
			const [startMatrix, endMatrix] = await Promise.all([
				distanceMatrixService.getDistanceMatrix({
					origins: [{ lng: 151.2099, lat: -33.865143 }],
					destinations: rides.map((r) => ({ lng: r.start_point.x, lat: r.start_point.y })),
					travelMode: google.maps.TravelMode.DRIVING
				}),
				distanceMatrixService.getDistanceMatrix({
					origins: rides.map((r) => ({ lng: r.end_point.x, lat: r.end_point.y })),
					destinations: [{ lng: 151.2099, lat: -33.865143 }],
					travelMode: google.maps.TravelMode.DRIVING
				})
			]);
			return rides.map((ride, i) => {
				const startDistanceMatrixElement = startMatrix.rows[0].elements[i];
				const endDistanceMatrixElement = endMatrix.rows[i].elements[0];
				return {
					...ride,
					startDistance: {
						distanceFromUser: startDistanceMatrixElement.distance.text,
						timeFromUser: startDistanceMatrixElement.duration.text
					},
					endDistance: {
						distanceFromUser: endDistanceMatrixElement.distance.text,
						timeFromUser: endDistanceMatrixElement.duration.text
					}
				};
			});
		} catch {
			return rides.map((ride) => ({
				...ride,
				startDistance: {
					distanceFromUser: 'Err',
					timeFromUser: 'Err'
				},
				endDistance: {
					distanceFromUser: 'Err',
					timeFromUser: 'Err'
				}
			}));
		}
	}
	const rides = $derived(getRides());

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

	function formatAddress(address: google.maps.GeocoderAddressComponent[]) {
		const end = address.findIndex((c) => c.types.find((t) => t === 'country') != null);
		return address
			.slice(0, end)
			.filter((comp) => !comp.types.find((v) => v.startsWith('administrative_area')))
			.reduceRight(
				(addr: string[], c) =>
					c.types.includes('street_number')
						? [`${c.short_name} ${addr[0]}`, ...addr.slice(1)]
						: [c.short_name, ...addr],
				[]
			)
			.map((addr) => `<div>${addr}</div>`)
			.join('');
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
					<div class="flex justify-between mb-2">
						<span class="text-lg font-bold text-brand">{ride.name}</span>
					</div>
					<div class="grid grid-cols-route-list gap-4">
						<div class="font-bold text-white">Start</div>
						<div class="col-span-3">
							{@html ride.start_address ? formatAddress(ride.start_address) : 'N/A'}
						</div>
						<div class="text-gray-300 ml-2">Distance from home</div>
						<div>{ride.startDistance.distanceFromUser}</div>
						<div class="text-gray-300">Time</div>
						<div>{ride.startDistance.timeFromUser}</div>
						<div class="font-bold text-white">Ride</div>
						<div class="font-bold text-brand col-span-2">
							{Math.round(ride.total_distance / 1000)}km
						</div>
						<div class="font-bold text-brand">{formatTime(ride.ride_time)}</div>
						<div class="font-bold text-white">End</div>
						<div class="col-span-3">
							{@html ride.end_address ? formatAddress(ride.end_address) : 'N/A'}
						</div>
						<div class="text-gray-300 ml-2">Distance to home</div>
						<div>{ride.endDistance.distanceFromUser}</div>
						<div class="text-gray-300">Time</div>
						<div>{ride.endDistance.timeFromUser}</div>
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
