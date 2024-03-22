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
            <div className="max-w-3x1 w-9/12 mx-auto shadow-lg rounded-xl overflow-hidden" style={{backgroundColor: "#F9F7F6"}}>
                <div className="p-4 text-center">
                    <span className="font-bold text-3xl text-black ml-2">Day {dayNumber}</span>
                </div>
                {data.timeOfDay.map((timeOfDay, timeIndex) => (
                    <div key={timeIndex} className="p-2 text-gray-800">
                        <div>
                            <div className="font-bold">
                                {timeOfDay.time.charAt(0).toUpperCase()}{timeOfDay.time.slice(1)}.&nbsp;
                            </div>
                        </div>
                        <div>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: assignLinksToTags(timeOfDay.description, data.tags),
                                }}
                            ></span>
                        </div>
                    </div>
                ))}

                <Places locations={data.tags} />
            </div>
        </>
    );
};

export default DayCard;
