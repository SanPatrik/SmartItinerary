import { GetIteniraryMock } from "@/ServerActions/getItenirary";
import DayCard from "@/components/DayCard";
import { Suspense } from "react";
import { MapContainer } from "./MapContainer";
import { MapRoot } from "./MapRoot";

type Props = {
    prompt: string;
};

export async function Itinerary(props: Props) {
    const itenirary = await GetIteniraryMock(props.prompt);
    if (!itenirary) {
        return <div>Failed to load itinerary</div>;
    }

    return (
        <div className=" md:p-4 rounded gap-10 flex w-full">
            <div className="flex flex-col gap-10 w-6/12">
                {itenirary.days.map((day, index) => (
                    <DayCard data={day} key={index} dayNumber={index + 1}/>
                ))}
            </div>
            <div className="w-6/12" style={{ height: "80vh" }}>
                <MapRoot itenirary={itenirary} />
            </div>
        </div>
    );
}
