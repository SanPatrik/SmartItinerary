"use client";
import React, { Suspense } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { GeolocateControl, NavigationControl } from "react-map-gl";
import { MapMarkers } from "./MapMarkers";
export const MapBox = () => {
    return (
        <Map
            mapboxAccessToken="pk.eyJ1IjoieG1paGFsaWtvIiwiYSI6ImNsaDJidHB1aTFjNWozZG9ncGlidHhiOGgifQ.cHfbnEE7SyAOD9zTuOAr-g"
            mapLib={import("mapbox-gl")}
            initialViewState={{
                longitude: -0.0760706875,
                latitude: 51.508094,
                zoom: 11,
            }}
            // style={{ width: "40vw", height: "40vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <NavigationControl />
            <GeolocateControl />
            <MapMarkers />
        </Map>
    );
};
