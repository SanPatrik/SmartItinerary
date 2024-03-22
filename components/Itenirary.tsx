import { GetItenirary, GetIteniraryMock } from "@/ServerActions/getItenirary";
import DayCard from "@/components/DayCard";
import { Suspense } from "react";
import { MapContainer } from "./MapContainer";
import { MapRoot } from "./MapRoot";

type Props = {
    prompt: string;
};

export async function Itinerary(props: Props) {
    const itenirary = await GetItenirary(props.prompt);
    if (!itenirary) {
        return <div>Failed to load itinerary</div>;
    }

    return (
        <div className="md:p-4 rounded gap-10 flex w-full bg-[#F9F7F6]">
            <div className="flex flex-col gap-10 w-6/12 overflow-y-scroll max-h-[80vh]">
                {itenirary.city} {itenirary.countryCode}
                {itenirary.introduction}
                {itenirary.days.map((day, index) => (
                    <div className="max-h-[100vh]" key={index}>
                        <DayCard data={day} dayNumber={index + 1} />
                    </div>
                ))}
            </div>
            <div className="w-6/12" style={{ height: "80vh" }}>
                <MapRoot itenirary={itenirary} />
            </div>
        </div>
    );
}
