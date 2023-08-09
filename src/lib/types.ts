export type ListRide = {
	id: string;
	name: string;
	total_distance: number;
	start_address?: GeoAddress;
	end_address?: GeoAddress;
};
export type Ride = {
	id: string;
	name: string;
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
	total_distance: number;
	start_address?: GeoAddress;
	end_address?: GeoAddress;
};
export interface GeoAddress {
	formatted_address: string;
}
