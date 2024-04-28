"use client";
import React, { useState, useEffect } from "react";

type PlacesProps = {
    locations: string[];
};

// Define the function to fetch photos
async function fetchPhotos(fsq_id: string) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "fsq390O7vuSwLgm2tdO3cvp8aKBHA0IPxpl7brNp2kCgYQM=",
        },
    };

    try {
        const response = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, options);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

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
    const [photos, setPhotos] = useState<any>(null);

    useEffect(() => {
        fetchPhotos(props.placeName)
            .then((data) => setPhotos(data.photos))
            .catch((err) => console.error(err));
    }, [props.placeName]);

    // Assemble the photo URL
    const photoUrl = photos && photos.length > 0 ? `${photos[0].prefix}original${photos[0].suffix}` : "";

    return (
        <div
            style={{ minWidth: "10rem", minHeight: "10rem", backgroundColor: "#ff6433" }}
            className="w-40 h-40 text-black text-center bg-white shadow-md m-2 rounded-md"
        >
            {props.placeName}
            {/* Display the fetched photo here */}
            {photoUrl && <img src={photoUrl} alt={props.placeName} />}
        </div>
    );
};
