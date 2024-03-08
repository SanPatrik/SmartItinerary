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
            `<a href="${links[index]}" target="_blank" rel="noopener noreferrer">${tag}</a>`,
        );
    });

    return description;
}

const DayCard = async ({ data }: { data: ItineraryDaySchema }) => {
    return (
        <>
            <div className="max-w-3x1 w-9/12 mx-auto bg-white shadow-lg rounded-md overflow-hidden">
                {data.timeOfDay.map((timeOfDay, timeIndex) => (
                    <div key={timeIndex} className="p-2 text-gray-800">
                        <div>
                            <span className="font-bold">{timeOfDay.time}. </span>
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
