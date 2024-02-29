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

/*
    Message for chatAI example:
        Give me a plan for two days in paris, include few museums and at least 3 sightseeings a day
 */

const TEMPLATE = `Extract the requested from the {input}.
Generate itinerary, trip to this place from their input.
also write down:
hotels they can book in and match it to the program and days,
shops they can visit,
where they can dine in, 
where they can make cafe stops, 
and sightseeing, tours they can visit also planned according to days and hotels`;

const itineraryLocationSchema = z.object({
    hotels: z.array(z.string()),
    activities: z.array(z.string()),
    shops: z.array(z.string()),
    restaurants: z.array(z.string()),
    cafes: z.array(z.string()),
});

const itineraryDayInfoSchema = z.object({
    time: z.enum(["morning", "afternoon", "evening"]),
    description: z.string(),
    activities: z.array(z.string()),
    locations: itineraryLocationSchema,
});

const itineraryDaySchema = z.object({
    timeOfDay: z.array(itineraryDayInfoSchema),
});

const itinerarySchema = z.object({
    introduction: z.string(),
    days: z.array(itineraryDaySchema),
});

export type ItinerarySchema = z.infer<typeof itinerarySchema>;
export type ItineraryDaySchema = z.infer<typeof itineraryDaySchema>;
export type ItineraryLocationSchema = z.infer<typeof itineraryLocationSchema>;
export type ItineraryDayInfoSchema = z.infer<typeof itineraryDayInfoSchema>;

/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function GetItenirary(prompt: string): Promise<ItinerarySchema | undefined> {
    "use server";
    try {
        if (!prompt) return undefined;
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

        console.log("Response:");
        console.log(parsedItineraryData);

        return parsedItineraryData;
    } catch (e: any) {
        return undefined;
    }
}

export const GetIteniraryMock = async (prompt: string): Promise<ItinerarySchema | undefined> => {
    console.log("using mock for prompt: ", prompt);
    return Promise.resolve(responseMock as ItinerarySchema);
};
