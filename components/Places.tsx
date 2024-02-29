import { ItineraryLocationSchema } from '@/ServerActions/getItenirary';
import React from 'react';

type PlacesProps = {
    locations: ItineraryLocationSchema
}

export const Places = (props: PlacesProps) => {
    
    return (
        <div className="flex flex-row">
            {/* Your component content goes here */}
        </div>
    );
};

// type PlaceProps = {
//     location: ItineraryLocationSchema
// }

// const Place = (props: PlaceProps) => {

// }