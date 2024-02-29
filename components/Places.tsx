import { ItineraryLocationSchema } from "@/ServerActions/getItenirary";
import React from "react";

type PlacesProps = {
    locations: ItineraryLocationSchema;
};

export const Places = (props: PlacesProps) => {
    return (
        <div className="flex flex-row gap-10">
            {props.locations.hotels.map((name, index) => {
                return <Place key={name} placeName={name} />;
            })}
            {props.locations.activities.map((name, index) => {
                return <Place key={name} placeName={name} />;
            })}
            {props.locations.shops.map((name, index) => {
                return <Place key={name} placeName={name} />;
            })}
            {props.locations.restaurants.map((name, index) => {
                return <Place key={name} placeName={name} />;
            })}
            {props.locations.cafes.map((name, index) => {
                return <Place key={name} placeName={name} />;
            })}
        </div>
    );
};

type PlaceProps = {
    placeName: string;
};

const Place = (props: PlaceProps) => {
    return <div className="w-40 h-40 bg-green-50 text-black">{props.placeName}</div>;
};
