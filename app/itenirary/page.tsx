import { Itinerary } from "@/components/Itenirary";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function IteniraryPage({ searchParams }: { searchParams: { [key: string]: string } }) {
    return (
        <div className="p-4 md:p-8 rounded bg-[#F9F7F6] w-full">
            <Suspense fallback={<div>Loading...</div>}>
                <Itinerary prompt={searchParams?.["prompt"] ?? ""} />
            </Suspense>
        </div>
    );
}
