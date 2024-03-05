import { GetItenirary, GetIteniraryMock, ItineraryLocationSchema } from "@/ServerActions/getItenirary";
import { Places } from "./Places";
import DayCard from "@/components/DayCard";

type Props = {
    prompt: string;
};

export async function Itinerary(props: Props) {
    const itenirary = await GetIteniraryMock(props.prompt);
    if (!itenirary) {
        return <div>Failed to load itinerary</div>;
    }

    const locations = itenirary?.days[0]?.timeOfDay[0]?.locations;
    const dayData = itenirary?.days[0];

    return (
        <div className=" md:p-4 rounded gap-10 flex w-full">
            <div className="flex flex-col gap-10">
                {itenirary.days.map((day, index) => (
                    <DayCard data={day} key={index} />
                ))}
            </div>
            <div className="w-6/12">map</div>
        </div>
    );
}
