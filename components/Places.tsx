import { ItinerarySchema } from '@/ServerActions/getItenirary';
import React from 'react';

type Places = {
    itenirary: ItinerarySchema
}

export const Places = (props: Places) => {
    const places = props.itenirary.days
    return (
        <div>
            {/* Your component content goes here */}
        </div>
    );
};


const Place = () => {

}