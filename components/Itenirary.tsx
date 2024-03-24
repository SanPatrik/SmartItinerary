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
                <div className="max-h-[100vh] ">
                    <div className="max-w-3x1 w-9/12 mx-auto shadow-lg rounded-xl overflow-hidden text-gray-800 bg-[#eaeaea]">
                        <div className="flex items-center justify-start p-2">
                            <div className="font-bold text-3xl text-black ml-1">{itenirary.city}</div>
                            <div className="font-bold text-2xl text-gray-500 ml-2">{itenirary.countryCode}</div>
                        </div>
                        <p className="mt-2 p-2">{itenirary.introduction}</p>
                    </div>
                </div>
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
