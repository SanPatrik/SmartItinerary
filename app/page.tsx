import { Itinerary } from "@/components/Itenirary";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function Home() {
    return (
        <div className="p-4 md:p-8 rounded bg-[#F9F7F6] w-full max-h-[85%] overflow-hidden flex flex-col items-center m-auto ">
            <h1 className="text-3xl md:text-4xl mb-4">Smart Itinerary</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <Form />
            </Suspense>
        </div>
    );
}

const Form = async () => {
    "use server";
    return (
        <form
            action={async (formData: FormData) => {
                "use server";
                redirect("itenirary/?prompt=" + formData.get("prompt"));
            }}
        >
            <input type="text" name="prompt" placeholder="Where do you want to go?" className="w-96" />
        </form>
    );
};
