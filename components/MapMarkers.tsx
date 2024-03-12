// "use server";
import React from "react";
import { Marker } from "react-map-gl";

type Props = {
    tags: string[];
};

export const MapMarkers = () => {
    // const tag = await fetch(
    //     `https://api.mapbox.com/geocoding/v5/mapbox.places/Tower%20of%20London.json?limit=1&proximity=ip&access_token=pk.eyJ1IjoieG1paGFsaWtvIiwiYSI6ImNsaDJidHB1aTFjNWozZG9ncGlidHhiOGgifQ.cHfbnEE7SyAOD9zTuOAr-g`,
    // );

    return (
        <>
            <Marker longitude={-0.0760706875} latitude={51.508094} />
            <Marker longitude={-0.120666} latitude={51.503266} />
        </>
    );
};
