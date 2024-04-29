"use client";
import React, { Suspense, useState } from "react";
import { ItinerarySchema } from "@/ServerActions/getItenirary";
import { MapContainer } from "./MapContainer";
import { Day } from "@/types/FoursqarePlaceSearchResponse";

type Props = {
    itenirary: ItinerarySchema;
    dayData: Day[][];
};

export const MapRoot = (props: Props) => {
    const [currentSelectedDay, setCurrentSelectedDay] = useState(0);

    return (
        <>
            {props.itenirary.days.map((day, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSelectedDay(index)}
                    className="rounded-md hover:bg-green-600 font-bold py-2 px-4 m-2 transition-colors duration-300 text-white"
                    style={{ backgroundColor: "#639E63" }}
                >
                    Day {index + 1}
                </button>
            ))}
            <Suspense fallback={<div>Loading</div>}>
                <MapContainer itenirary={props.itenirary} selectedDay={currentSelectedDay} dayData={props.dayData} />
            </Suspense>
        </>
    );
};
