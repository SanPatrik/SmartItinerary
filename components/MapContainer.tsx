import React from "react";
import { MapBox } from "./MapBox";
import { ItinerarySchema } from "@/ServerActions/getItenirary";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";
import routesMock from "@/ServerActions/routesMock.json";
import { DirectionApiResponse } from "@/types/DirectionsApiResponse";
import { Day } from "@/types/FoursqarePlaceSearchResponse";

type Props = {
    itenirary: ItinerarySchema;
    selectedDay: number;
    dayData: Day[][];
};

const encodeLocations = (locations: number[][]) => {
    const parsedLocation = locations.map(([longitude, latitude]) => `${longitude},${latitude}`).join(";");
    return encodeURIComponent(parsedLocation);
};

const encodeLocationsComma = (locations: number[][]) => {
    const parsedLocation = locations.map(([longitude, latitude]) => `${longitude},${latitude}`).join(",");
    return encodeURIComponent(parsedLocation);
};

export const MapContainer = async (props: Props) => {
    // Fetch latitude and longitude for the city
    let cityResponse = undefined;
    try {
        cityResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                props.itenirary.city,
            )}.json?access_token=${process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN}`,
        );
    } catch {
        return <div>No locations found</div>;
    }
    const cityData = await cityResponse.json();
    const cityCoordinates = cityData.features[0]?.center;

    // const fetchData = () => {
    //     const itinerary = props.itenirary?.days?.[props.selectedDay];
    //     const fetchPromises = [];
    //     if (!itinerary?.tags) return [];
    //     for (const tag of itinerary.tags) {
    //         const urlEncoded = encodeURIComponent(tag);
    //         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${urlEncoded}.json?country=${props.itenirary.countryCode.toLowerCase()}&limit=1&proximity=${encodeLocationsComma(
    //             [cityCoordinates],
    //         )}&access_token=${process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN}`;
    //         fetchPromises.push(fetch(url));
    //     }
    //     return fetchPromises;
    // };

    // const promises = fetchData();
    // let tagsPromises: Response[] | undefined;
    // try {
    //     tagsPromises = await Promise.all(promises);
    // } catch {
    //     return <div>No locations found</div>;
    // }
    // const tags: GeolocationApiResponse[] = [];
    // for (const tag of tagsPromises) {
    //     const response = await tag.json();
    //     tags.push(response);
    // }

    // if (!tags) {
    //     return <div>No locations found</div>;
    // }

    // const locations = tags.map((tag) => tag.features?.[0]?.center).filter((location) => location?.[0] && location?.[1]);
    // const filteredLocations = locations.filter((location) => location) as number[][];

    // const routeResponse = await fetch(
    //     `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeLocations(
    //         filteredLocations,
    //     )}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1IjoieG1paGFsaWtvIiwiYSI6ImNsaDJicGpqNDFjOGEzZGp1eTl1dm56ejQifQ.vqQeGERHnQuR5uq4XUpY2A`,
    // ).catch(() => undefined);

    // if (!routeResponse) {
    //     return <div>No routes found</div>;
    // }
    // const route: DirectionApiResponse = await routeResponse.json();
    // const routeCoordinates = route.routes?.[0]?.geometry?.coordinates;

    // if (!routeCoordinates) {
    //     return <div>No routes found</div>;
    // }

    // return <MapBox tags={tags} route={routeCoordinates} city={cityCoordinates} />;
    return <MapBox tags={props.dayData?.[props.selectedDay] ?? []} route={[]} city={cityCoordinates} />;
};
