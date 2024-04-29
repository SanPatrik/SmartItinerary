import { Result } from "@/types/FoursqarePlaceSearchResponse";
import React from "react";

type Props = {
    popupInfo: Result;
};

export const MapPopupContent = async (props: Props) => {
    // do the foursquare api Dominik

    return (
        <div>
            <div>{props.popupInfo?.name}</div>
            <div>{props.popupInfo?.link}</div>
        </div>
    );
};
