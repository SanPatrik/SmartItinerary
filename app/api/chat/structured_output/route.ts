import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const runtime = "edge";

const TEMPLATE = `
Extract the requested fields from the inputs.

The field "location" refers to the place.
The field "preferencies" refers to the preferencies from user on what he wants to do on the trip.

Generate itinerary, trip to this place: {location}

With these optional preferencies: {preferencies}

if preferencies == empty then create average from available data

also write down:
hotels they can book in and match it to the program and days,
shops they can visit,
where they can dine in, 
where they can make cafe stops, 
and sightseeing, tours they can visit also planned according to days and hotels
`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // const locationReq = body.location ?? [];
        // const preferenciesReq = body.preferencies ?? [];
        // const location = locationReq[locationReq.length - 1].content;
        // const preferencies = preferenciesReq[preferenciesReq.length - 1].content;
        const messages = body.messages ?? [];
        const currentMessageContent = messages[messages.length - 1].content;
        const prompt = PromptTemplate.fromTemplate(TEMPLATE);


        /**
         * Function calling is currently only supported with ChatOpenAI models
         */
        const model = new ChatOpenAI({
            temperature: 0.8,
            modelName: "gpt-3.5-turbo",
        });

        /**
         * We use Zod (https://zod.dev) to define our schema for convenience,
         * but you can pass JSON Schema directly if desired.
         */
        const DaySchema = z.object({
            day_number: z.number(),
            description: z.string(),
            activities: z.array(z.string()),
            locations: z.object({
                hotels: z.array(z.string()),
                activities: z.array(z.string()),
                shops: z.array(z.string()),
                restaurants: z.array(z.string()),
                cafe: z.array(z.string()),
            }),
        });

        const ItinerarySchema = z.object({
            introduction: z.string(),
            days: z.array(DaySchema),
        });
        /**
         *
         * Bind the function and schema to the OpenAI model.
         * Future invocations of the returned model will always use these arguments.
         *
         * Specifying "function_call" ensures that the provided function will always
         * be called by the model.
         */
        const functionCallingModel = model.bind({
            functions: [
                {
                    name: "output_formatter",
                    description: "Should always be used to properly format output",
                    parameters: zodToJsonSchema(ItinerarySchema),
                },
            ],
            function_call: { name: "output_formatter" },
        });

        /**
         * Returns a chain with the function calling model.
         */
        const chain = prompt.pipe(functionCallingModel).pipe(new JsonOutputFunctionsParser());

        const result = await chain.invoke({
            location: currentMessageContent,
            preferencies: ""
        });

        return NextResponse.json(result, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
