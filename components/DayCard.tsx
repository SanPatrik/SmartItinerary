import { ItineraryDaySchema } from "@/ServerActions/getItenirary";

const DayCard = async ({ data }: { data: ItineraryDaySchema }) => {
    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden">
            {data.timeOfDay.map((timeOfDay, timeIndex) => (
                <div key={timeIndex} className="p-2 text-gray-800">
                    <div>
                        <span className="font-bold">{timeOfDay.time}. </span>
                        {timeOfDay.description}
                    </div>
                    <div className="mt-2 text-blue-500">{timeOfDay.activities}</div>
                </div>
            ))}
        </div>
    )
}

export default DayCard;