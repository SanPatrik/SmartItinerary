import { GeolocationApiResponse } from "@/types/GeolocationApiResponse";
import React from "react";

type Props = {
    popupInfo: GeolocationApiResponse;
};

export const MapPopupContent = async (props: Props) => {
    // do the foursquare api Dominik
    return <div>{props.popupInfo.features?.[0]?.text}</div>;
};
