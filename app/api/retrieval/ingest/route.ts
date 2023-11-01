import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const runtime = "edge";

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
export async function POST(req: NextRequest) {
    const body = await req.formData();

    const text = body.get('text');
    const pdfFile = body.get('pdf') as File;

    try {
        //Upload do SupaBase DB
        // const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
        //
        // const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
        //     chunkSize: 256,
        //     chunkOverlap: 20,
        // });
        //
        // const splitDocuments = await splitter.createDocuments([text]);
        //
        // const vectorstore = await SupabaseVectorStore.fromDocuments(splitDocuments, new OpenAIEmbeddings(), {
        //     client,
        //     tableName: "documents",
        //     queryName: "match_documents",
        // });

        return NextResponse.json({ text: text, pdfFile: pdfFile.name }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
