"use client"

import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from "react";

// @ts-ignore
const ItineraryShowcase = ({data}) => {
    console.log(data);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">City: {data.city}, Country: {data.country}</h1>

            {data.days.map((day: { label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; timesOfDay: any[]; }, dayIndex: Key | null | undefined) => (
                <div key={dayIndex} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{day.label}</h2>

                    {day.timesOfDay.map((timeOfDay, timeIndex) => (
                        <div key={timeIndex} className="mb-2">
                            <h3 className="text-lg font-medium mb-1">{timeOfDay.label}</h3>

                            <ul className="list-disc pl-4">
                                {timeOfDay.activities.map((activity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, activityIndex: Key | null | undefined) => (
                                    <li key={activityIndex} className="mb-1">{activity}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <br/>
                </div>
            ))}
        </div>
    )
}

export default ItineraryShowcase;