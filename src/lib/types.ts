export type ListRide = {
	id: string;
	name: string;
	total_distance: number;
	start_address?: google.maps.GeocoderAddressComponent[];
	end_address?: google.maps.GeocoderAddressComponent[];
};
export type Ride = ListRide & {
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};
export interface LatLng {
	lat: number;
	lng: number;
}
