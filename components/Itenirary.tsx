import { GetItenirary, GetIteniraryMock, ItineraryLocationSchema } from "@/ServerActions/getItenirary";
import { Places } from "./Places";

type Props = {
    prompt: string;
}

export async function Itinerary(props: Props) {
    const itenirary = await GetIteniraryMock(props.prompt);
    if (!itenirary) {
        return <div>Failed to load itinerary</div>
    }

    const locations = itenirary?.days[0]?.timeOfDay[0]?.locations
    return (
        <div className="p-4 md:p-8 rounded ">
            <h1 className="text-3xl md:text-4xl mb-4">▲ Smart Itinerary 🔗</h1>
            {JSON.stringify(itenirary)}
            <Places locations={locations} />
        </div>
    );
}