import React from "react";
import { MapBox } from "./MapBox";
import { ItinerarySchema } from "@/ServerActions/getItenirary";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";

type Props = {
    itenirary: ItinerarySchema;
    selectedDay: number;
};

export const MapContainer = async (props: Props) => {
    const fetchData = () => {
        const itinerary = props.itenirary;
        const fetchPromises = [];
        for (const tag of itinerary.days[props.selectedDay].tags) {
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
    return <MapBox tags={tags} />;
};
