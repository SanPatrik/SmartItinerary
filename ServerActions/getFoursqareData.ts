// export async function getFoursqareData(tags: string[], near: string): Promise<any> {
//     const options = {
//         method: "GET",
//         headers: {
//             accept: "application/json",
//             Authorization: "fsq390O7vuSwLgm2tdO3cvp8aKBHA0IPxpl7brNp2kCgYQM=",
//         },
//     };

import { Day } from "@/types/FoursqarePlaceSearchResponse";

//     const baseURL = "https://api.foursquare.com/v3/places/search";
//     const params = {
//         query: "pub",
//         near: "London",
//     };

//     const url = new URL(baseURL);
//     url.search = new URLSearchParams(params).toString();

//     const response = await fetch(url, options).catch((err) => {
//         console.error(err);
//         return undefined;
//     });
//     if (!response || !response.ok) {
//         return undefined;
//     }
//     const data = await response.json();
//     console.log(data);

//     return data;
// }

export async function getFoursqareData(tags: string[], near: string): Promise<Day[]> {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "fsq390O7vuSwLgm2tdO3cvp8aKBHA0IPxpl7brNp2kCgYQM=",
        },
    };

    const baseURL = "https://api.foursquare.com/v3/places/search";

    const fetchPromises = tags.map(async (tag) => {
        const params = {
            query: tag,
            near: near,
        };

        const url = new URL(baseURL);
        url.search = new URLSearchParams(params).toString();

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                return undefined;
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    });

    const results = await Promise.all(fetchPromises).catch((err) => {
        console.error(err);
        return [];
    });
    return results;
}
