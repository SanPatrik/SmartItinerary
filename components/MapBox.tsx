"use client";
import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";

type Props = {
    tags: GeolocationApiResponse[];
};

export const MapBox = (props: Props) => {
    console.log(props.tags);
    return (
        <Map
            mapboxAccessToken="pk.eyJ1IjoieG1paGFsaWtvIiwiYSI6ImNsaDJidHB1aTFjNWozZG9ncGlidHhiOGgifQ.cHfbnEE7SyAOD9zTuOAr-g"
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
            {props.tags.map((tag) => {
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
