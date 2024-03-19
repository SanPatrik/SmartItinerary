"use client";
import React, { useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";

type Props = {
    tags: GeolocationApiResponse[];
};

export const MapBox = (props: Props) => {
    const safeTags = useMemo(() => {
        return props.tags.filter((tag) => tag?.features?.length > 0);
    }, [props.tags]);
    return (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN}
            mapLib={import("mapbox-gl")}
            initialViewState={{
                longitude: -0.0760706875,
                latitude: 51.508094,
                zoom: 11,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <NavigationControl />
            <GeolocateControl />
            {safeTags.map((tag) => {
                return (
                    <Marker
                        key={tag.features[0].id}
                        longitude={tag.features[0].center[0]}
                        latitude={tag.features[0].center[1]}
                    />
                );
            })}
        </Map>
    );
};
