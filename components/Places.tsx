import React from "react";

type PlacesProps = {
    locations: string[];
};

export const Places = (props: PlacesProps) => {
    return (
        <div className="overflow-auto flex flex-row gap-10">
            {props.locations.map((tag) => {
                return <Place key={tag} placeName={tag} />;
            })}
        </div>
    );
};

type PlaceProps = {
    placeName: string;
};

const Place = (props: PlaceProps) => {
    return (
        <div style={{ minWidth: "10rem", minHeight: "10rem" }} className="w-40 h-40 bg-green-50 text-black">
            {props.placeName}
        </div>
    );
};
