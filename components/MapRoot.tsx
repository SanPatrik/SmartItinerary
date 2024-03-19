"use client";
import React, { Suspense, useState } from "react";
import { ItinerarySchema } from "@/ServerActions/getItenirary";
import { MapContainer } from "./MapContainer";

type Props = {
    itenirary: ItinerarySchema;
};

export const MapRoot = (props: Props) => {
    const [currentSelectedDay, setCurrentSelectedDay] = useState(0);

    return (
        <>
            {props.itenirary.days.map((day, index) => (
                <button key={index} onClick={() => setCurrentSelectedDay(index)}>
                    day {index + 1}
                </button>
            ))}
            <Suspense fallback={<div>Loading</div>}>
                <MapContainer itenirary={props.itenirary} selectedDay={currentSelectedDay} />
            </Suspense>
        </>
    );
};
