export interface GeolocationApiResponse {
    type: string;
    query: string[];
    features: Feature[];
    attribution: string;
}

export interface Feature {
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: Properties;
    text: string;
    place_name: string;
    center: number[];
    geometry: Geometry;
    context: Context[];
}

export interface Properties {
    foursquare: string;
    address: string;
    wikidata: string;
    landmark: boolean;
    category: string;
}

export interface Geometry {
    coordinates: number[];
    type: string;
}

export interface Context {
    id: string;
    mapbox_id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
}
