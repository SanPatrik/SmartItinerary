import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { AIMessage, ChatMessage, HumanMessage } from "langchain/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createRetrieverTool, OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
    if (message.role === "user") {
        return new HumanMessage(message.content);
    } else if (message.role === "assistant") {
        return new AIMessage(message.content);
    } else {
        return new ChatMessage(message.content, message.role);
    }
};

const TEMPLATE = `Extract the requested from the {input}.

Generate itinerary, trip to this place from their input.
also write down:
hotels they can book in and match it to the program and days,
shops they can visit,
where they can dine in, 
where they can make cafe stops, 
and sightseeing, tours they can visit also planned according to days and hotels
Parse this itinerary and return JSON with this structure and return only JSON: 'z.object({{
    introduction: z.string(),
    days: z.array(
        z.object({{
            timeOfDay: z.array(
                z.object({{
                    time: z.enum(["morning", "afternoon", "evening"]),
                    description: z.string(),
                    activities: z.array(z.string()),
                    locations: z.object({{
                        hotels: z.array(z.string()),
                        activities: z.array(z.string()),
                        shops: z.array(z.string()),
                        restaurants: z.array(z.string()),
                        cafes: z.array(z.string()),
                    }}),
                }}),
            )}},
        }}),
    ),
}});'`



/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        /**
         * We represent intermediate steps as system messages for display purposes,
         * but don't want them in the chat history.
         */
        const messages = (body.messages ?? []).filter(
            (message: VercelChatMessage) => message.role === "user" || message.role === "assistant",
        );
        const returnIntermediateSteps = body.show_intermediate_steps;
        const previousMessages = messages.slice(0, -1);
        const currentMessageContent = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
        });

        const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });

        const chatHistory = new ChatMessageHistory(previousMessages.map(convertVercelMessageToLangChainMessage));

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
            chatHistory,
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

        if (returnIntermediateSteps) {
            return NextResponse.json(
                { output: result.output, intermediate_steps: result.intermediateSteps },
                { status: 200 },
            );
        } else {
            // Agent executors don't support streaming responses (yet!), so stream back the complete response one
            // character at a time to simluate it.
            const textEncoder = new TextEncoder();
            const fakeStream = new ReadableStream({
                async start(controller) {
                    for (const character of result.output) {
                        controller.enqueue(textEncoder.encode(character));
                        await new Promise((resolve) => setTimeout(resolve, 20));
                    }
                    controller.close();
                },
            });

            return new StreamingTextResponse(fakeStream);
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
