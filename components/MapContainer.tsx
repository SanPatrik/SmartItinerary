import React from "react";
import { MapBox } from "./MapBox";
import { ItinerarySchema } from "@/ServerActions/getItenirary";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";
import routesMock from "@/ServerActions/routesMock.json";
import { DirectionApiResponse } from "@/types/DirectionsApiResponse";

type Props = {
    itenirary: ItinerarySchema;
    selectedDay: number;
};

const encodeLocations = (locations: number[][]) => {
    const parsedLocation = locations.map(([longitude, latitude]) => `${longitude},${latitude}`).join(";");
    return encodeURIComponent(parsedLocation);
};

export const MapContainer = async (props: Props) => {
    const fetchData = () => {
        const itinerary = props.itenirary?.days?.[props.selectedDay];
        const fetchPromises = [];
        if (!itinerary?.tags) return [];
        for (const tag of itinerary.tags) {
            const urlEncoded = encodeURIComponent(tag);
            fetchPromises.push(
                fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${urlEncoded}.json?country=gb&limit=1&proximity=ip&access_token=${process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN}`,
                ),
            );
        }
        return fetchPromises;
    };

    const promises = fetchData();

    const tagsPromises = await Promise.all(promises);
    const tags: GeolocationApiResponse[] = [];
    for (const tag of tagsPromises) {
        const response = await tag.json();
        tags.push(response);
    }

    if (!tags) {
        return <div>No locations found</div>;
    }

    const locations = tags.map((tag) => tag.features[0]?.center).filter((location) => location?.[0] && location?.[1]);

    const filteredLocations = locations.filter((location) => location) as number[][];

    const routeResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeLocations(
            filteredLocations,
        )}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1IjoieG1paGFsaWtvIiwiYSI6ImNsaDJicGpqNDFjOGEzZGp1eTl1dm56ejQifQ.vqQeGERHnQuR5uq4XUpY2A`,
    );

    const route: DirectionApiResponse = await routeResponse.json();
    const routeCoordinates = route.routes?.[0]?.geometry?.coordinates;

    if (!routeCoordinates) {
        return <div>No routes found</div>;
    }

    return <MapBox tags={tags} route={routeCoordinates} />;
};
