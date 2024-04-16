"use client";
import React, { useState } from "react";

type PlacesProps = {
    locations: string[];
};

export const Places = (props: PlacesProps) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleLeftClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 100;
            setScrollPosition(containerRef.current.scrollLeft);
        }
    };

    const handleRightClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 100;
            setScrollPosition(containerRef.current.scrollLeft);
        }
    };

    return (
        <div className="flex flex-row items-center">
            <button
                onClick={handleLeftClick}
                disabled={scrollPosition === 0}
                className="m-0.5 text-black rounded-full"
                style={{ borderRadius: "50%", minHeight: "1.5rem", minWidth: "1.5rem", backgroundColor: "#ff6433" }}
            >
                {"<"}
            </button>
            <div ref={containerRef} className="overflow-auto flex flex-row">
                {props.locations.map((tag, index) => {
                    return <Place key={index} placeName={tag} />;
                })}
            </div>
            <button
                onClick={handleRightClick}
                disabled={false}
                className="m-0.5 text-black"
                style={{ borderRadius: "50%", minHeight: "1.5rem", minWidth: "1.5rem", backgroundColor: "#ff6433" }}
            >
                {">"}
            </button>
        </div>
    );
};

type PlaceProps = {
    placeName: string;
};

const Place = (props: PlaceProps) => {
    return (
        <div
            style={{ minWidth: "10rem", minHeight: "10rem", backgroundColor: "#ff6433" }}
            className="w-40 h-40 text-black text-center bg-white shadow-md m-2 rounded-md"
        >
            {props.placeName}
        </div>
    );
};
