import { ItineraryDaySchema } from "@/ServerActions/getItenirary";
import { Places } from "./Places";

const DayCard = async ({ data }: { data: ItineraryDaySchema }) => {
    return (
        <>
            <div className="max-w-3x1 w-9/12 mx-auto bg-white shadow-lg rounded-md overflow-hidden">
                {data.timeOfDay.map((timeOfDay, timeIndex) => (
                    <div key={timeIndex} className="p-2 text-gray-800">
                        <div>
                            <span className="font-bold">{timeOfDay.time}. </span>
                            {timeOfDay.description}
                        </div>
                        <div className="mt-2 text-blue-500">{timeOfDay.activities}</div>
                        <Places locations={timeOfDay.locations} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default DayCard;
