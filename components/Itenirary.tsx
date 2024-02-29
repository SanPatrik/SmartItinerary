import { GetItenirary, GetIteniraryMock } from "@/ServerActions/getItenirary";

type Props = {
    prompt: string;
}

export async function Itinerary(props: Props) {
    const itenirary = await GetIteniraryMock(props.prompt);

    return (
        <div className="p-4 md:p-8 rounded ">
            <h1 className="text-3xl md:text-4xl mb-4">▲ Smart Itinerary 🔗</h1>
            {JSON.stringify(itenirary)}
        </div>
    );
}