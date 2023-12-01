export type ListRide = {
	id: string;
	name: string;
	total_distance: number;
	start_address: Address;
	end_address: Address;
	start_point: Point;
	end_point: Point;
	time_from_origin_to_start?: number;
	time_from_end_to_origin?: number;
};
export type Ride = ListRide & {
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
	ways: RideWay[];
};
export type Address = {
	tourism?: string;
	road: string;
	suburb: string;
	city: string;
	municpality: string;
	state: string;
	postcode: string;
	country: string;
};

export type RideWay = {
	place_id: number;
	distance: number;
};

export interface Point {
	x: number;
	y: number;
}
