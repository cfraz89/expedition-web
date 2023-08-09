export type ListRide = { id: string; name: string; total_distance: number };
export type Ride = {
	id: string;
	name: string;
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
	total_distance: number;
};
