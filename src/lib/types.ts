export type ListRide = { id: string; name: string };
export type Ride = {
	id: string;
	name: string;
	geo_json: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
};
