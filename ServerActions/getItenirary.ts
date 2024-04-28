import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createRetrieverTool, OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import responseMock from "./responseMock.json";

// export const runtime = "edge";

const TEMPLATE = `
Extract the request from the "{input}" in any language.
    Generate itinerary trip for this input: "{input}", with all the specific requirements in it in that language.
    Write down:
    City name, country code (ISO 3166-1 A-2), introduction, separate each day into times ("morning", "afternoon", "evening") then generate description for each time and generate "places" and "tags".
    "Places" are locations, activities, hotels, monuments, sightseeing's. These will be exactly extracted from description texts, so they must be equal to the locations taken from description, and can be later used to map location on the said "place" from description (example: map location place to some URL).
    "Tags" are like categories that can be assigned to said specific "places" and based on input: {input}, preferences.
These "places" are locations that are recommended based on the requirements from the input: "{input}". They should be specific real locations that have specific name for that city from itinerary input! Try writing them in the way that we can easily find them by googling them. Meaning if its to general you can add the city name to that "place".
Descriptions should be created with requirements, based on input: "{input}" and it should contain said "places" based on these requirements.
    Plan everything in order, so if we go somewhere in morning chronologically we go in order trough the destination and we will not hop from one side of the city to another and vice versa.
    If input does not contain any real location return error.
    Itinerary should be professional like from tourism company.
`;

const itineraryDayInfoSchema = z.object({
    time: z.enum(["morning", "afternoon", "evening"]),
    description: z.string(),
});

const itineraryDaySchema = z.object({
    timeOfDay: z.array(itineraryDayInfoSchema),
    places: z.array(z.string()),
    tags: z.array(z.string()),
});

const itinerarySchema = z.object({
    city: z.string(),
    countryCode: z.string(),
    introduction: z.string(),
    days: z.array(itineraryDaySchema),
});

export type ItinerarySchema = z.infer<typeof itinerarySchema>;
export type ItineraryDaySchema = z.infer<typeof itineraryDaySchema>;

type ItinerarySchemaReturn = { schema?: ItinerarySchema; error?: string };

/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function GetItenirary(prompt: string): Promise<ItinerarySchemaReturn> {
    "use server";
    try {
        if (!prompt) return { error: "No prompt provided" };
        const currentMessageContent = prompt;

        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
        });

        const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });

        // const chatHistory = new ChatMessageHistory(previousMessages.map(convertVercelMessageToLangChainMessage));

        /**
         * This is a special type of memory specifically for conversational
         * retrieval agents.
         * It tracks intermediate steps as well as chat history up to a
         * certain number of tokens.
         *
         * The default OpenAI Functions agent prompt has a placeholder named
         * "chat_history" where history messages get injected - this is why
         * we set "memoryKey" to "chat_history". This will be made clearer
         * in a future release.
         */
        const memory = new OpenAIAgentTokenBufferMemory({
            llm: model,
            memoryKey: "chat_history",
            outputKey: "output",
        });

        const retriever = vectorstore.asRetriever();

        /**
         * Wrap the retriever in a tool to present it to the agent in a
         * usable form.
         */
        const tool = createRetrieverTool(retriever, {
            name: "search_latest_knowledge",
            description: "Searches and returns up-to-date general information.",
        });

        const executor = await initializeAgentExecutorWithOptions([tool], model, {
            agentType: "openai-functions",
            memory,
            returnIntermediateSteps: true,
            verbose: true,
            agentArgs: {
                prefix: TEMPLATE,
            },
        });

        const result = await executor.call({
            input: currentMessageContent,
        });

        console.log("Output:");
        console.log(result.output);

        const parser = StructuredOutputParser.fromZodSchema(itinerarySchema);

        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(
                "Parse the result according to format instructions.\n{format_instructions}\n{trip_plan_result}",
            ),
            new ChatOpenAI({ temperature: 0 }),
            parser,
        ]);

        console.log("Parsed data:");
        console.log(parser.getFormatInstructions());

        const parsedItineraryData = await chain.invoke({
            trip_plan_result: result.output,
            format_instructions: parser.getFormatInstructions(),
        });

        parsedItineraryData.days.forEach((day) => {
            console.log("Response:");
            console.log(day.tags);
        });

        return { schema: parsedItineraryData };
    } catch (e: any) {
        console.error("Failed to get itenirary: ", e);
        return { error: e };
    }
}

export const GetIteniraryMock = async (prompt: string): Promise<ItinerarySchema | undefined> => {
    console.log("using mock for prompt: ", prompt);
    return Promise.resolve(responseMock as ItinerarySchema);
};
