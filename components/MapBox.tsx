"use client";
import React, { Suspense, useMemo, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { GeolocateControl, Layer, LineLayer, Marker, NavigationControl, Popup, Source } from "react-map-gl";
import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";
import type { FeatureCollection } from "geojson";
import { MapPopupContent } from "./MapPopupContent";
import { Day, Result } from "@/types/FoursqarePlaceSearchResponse";
import PrintOnClient from "./PrintOnClient";
type Props = {
    tags: Day[];
    route: number[][];
    city: number[];
};

export const MapBox = (props: Props) => {
    const [popupInfo, setPopupInfo] = useState<Result | undefined>(undefined);

    const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [...props.route],
                },
            },
        ],
    };

    const layerStyle: LineLayer = {
        id: "route",
        type: "line",
        source: "route",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#F88F33",
            "line-width": 4,
        },
    };

    return (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN}
            mapLib={import("mapbox-gl")}
            initialViewState={{
                longitude: props.city[0] ?? 0,
                latitude: props.city[1] ?? 0,
                zoom: 11,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            {/* <PrintOnClient toPrint={asdf} /> */}
            <NavigationControl />
            <GeolocateControl />
            {props.tags
                .map((tag, index) => {
                    return tag?.results?.map((result) => {
                        return (
                            <Marker
                                key={result?.fsq_id ?? index}
                                longitude={result?.geocodes?.main?.longitude ?? 0}
                                latitude={result?.geocodes?.main?.latitude ?? 0}
                                onClick={(e) => {
                                    // If we let the click event propagates to the map, it will immediately close the popup
                                    // with `closeOnClick: true`
                                    e.originalEvent.stopPropagation();
                                    setPopupInfo(result);
                                }}
                            ></Marker>
                        );
                    });
                })
                .flat()}
            {popupInfo && (
                <Popup
                    anchor="top"
                    longitude={Number(popupInfo?.geocodes?.main?.longitude ?? 0)}
                    latitude={Number(popupInfo?.geocodes?.main?.latitude ?? 0)}
                    onClose={() => setPopupInfo(undefined)}
                >
                    <Suspense>
                        <MapPopupContent popupInfo={popupInfo} />
                    </Suspense>
                </Popup>
            )}
            <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
            </Source>
        </Map>
    );
};
