import { ItineraryDaySchema } from "@/ServerActions/getItenirary";
import { Places } from "./Places";

function assignLinksToTags(description: string, tags: string[]): string {
    const links: string[] = [];

    // Generate encoded URLs
    tags.forEach((tag) => {
        const encodedTag = encodeURIComponent(tag);
        links.push(`https://www.google.com/search?q=${encodedTag}`);
    });

    // Replace tags in the description with anchor tags
    tags.forEach((tag, index) => {
        const tagRegex = new RegExp(tag.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"); // Escaping special characters
        description = description.replace(
            tagRegex,
            `<a href="${links[index]}" class="text-purple-600" target="_blank" rel="noopener noreferrer">${tag}</a>`,
        );
    });

    return description;
}

const DayCard = ({ data, dayNumber }: { data: ItineraryDaySchema, dayNumber: number }) => {
    return (
        <>
            <div className="max-w-3x1 w-9/12 mx-auto bg-purple-200 shadow-lg rounded-md overflow-hidden">
                <div className="p-2 font-bold text-2xl text-center text-purple-800">Day {dayNumber}</div>
                <div className="bg-white m-2 rounded-md shadow-md">
                    {data.timeOfDay.map((timeOfDay, timeIndex) => (
                        <div key={timeIndex} className="p-2 text-gray-800">
                            <div>
                                <span className="font-bold">
                                    {timeOfDay.time.charAt(0).toUpperCase()}{timeOfDay.time.slice(1)}.
                                    &nbsp;
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: assignLinksToTags(timeOfDay.description, data.tags),
                                    }}
                                ></span>
                            </div>
                        </div>
                    ))}
                </div>
                <Places locations={data.tags} />
            </div>
        </>
    );
};

export default DayCard;
