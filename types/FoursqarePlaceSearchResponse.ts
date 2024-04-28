export type FoursqaureDays = Day[][];

export interface Day {
    results: Result[];
    context: Context;
}

export interface Result {
    fsq_id: string;
    categories: Category[];
    chains: Chain[];
    closed_bucket: string;
    distance: number;
    geocodes: Geocodes;
    link: string;
    location: Location;
    name: string;
    related_places: RelatedPlaces;
    timezone?: string;
}

export interface Category {
    id: number;
    name: string;
    short_name: string;
    plural_name: string;
    icon: Icon;
}

export interface Icon {
    prefix: string;
    suffix: string;
}

export interface Chain {
    id: string;
    name: string;
}

export interface Geocodes {
    main: Main;
    roof?: Roof;
    drop_off?: DropOff;
}

export interface Main {
    latitude: number;
    longitude: number;
}

export interface Roof {
    latitude: number;
    longitude: number;
}

export interface DropOff {
    latitude: number;
    longitude: number;
}

export interface Location {
    admin_region?: string;
    country: string;
    formatted_address: string;
    locality?: string;
    po_box?: string;
    post_town?: string;
    postcode?: string;
    region?: string;
    address?: string;
    cross_street?: string;
    address_extended?: string;
}

export interface RelatedPlaces {
    parent?: Parent;
    children?: Children[];
}

export interface Parent {
    fsq_id: string;
    categories: Category2[];
    name: string;
}

export interface Category2 {
    id: number;
    name: string;
    short_name: string;
    plural_name: string;
    icon: Icon2;
}

export interface Icon2 {
    prefix: string;
    suffix: string;
}

export interface Children {
    fsq_id: string;
    categories: Category3[];
    name: string;
}

export interface Category3 {
    id: number;
    name: string;
    short_name: string;
    plural_name: string;
    icon: Icon3;
}

export interface Icon3 {
    prefix: string;
    suffix: string;
}

export interface Context {
    geo_bounds: GeoBounds;
}

export interface GeoBounds {
    circle: Circle;
}

export interface Circle {
    center: Center;
    radius: number;
}

export interface Center {
    latitude: number;
    longitude: number;
}
