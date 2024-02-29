import {
    GetIteniraryMock,
    ItineraryDayInfoSchema,
    ItineraryDaySchema,
    ItinerarySchema
} from "@/ServerActions/getItenirary";

const DayCard = async ({ data }: { data: ItineraryDaySchema }) => {
    return (
        <div>
            {data.timeOfDay.map((timeOfDay, timeIndex) => (
                <div>
                    <h3>{timeOfDay.time}</h3>
                    <p>{timeOfDay.description}</p>
                    <p>{timeOfDay.activities}</p>
                </div>
            ))}
        </div>
    )
}


export default DayCard;