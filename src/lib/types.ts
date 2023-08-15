export type ListRide = {
	id: string;
	name: string;
	total_distance: number;
	start_address?: google.maps.GeocoderAddressComponent[];
	end_address?: google.maps.GeocoderAddressComponent[];
	start_point: Point;
};
export type Ride = ListRide & {
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};

export interface Point {
	x: number;
	y: number;
}
