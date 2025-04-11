"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContentManager() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        } else {
        }
    }, [router]);

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Area gestione contenuti</h1>
            <ul className="list-disc">
                <li>
                    <Link
                        className="text-blue-600 underline underline-offset-4 hover:decoration-wavy"
                        href="/admin/pages"
                    >
                        Modifica pagine sito
                    </Link>
                </li>
                <li>
                    <Link
                        className="text-blue-600 underline underline-offset-4 hover:decoration-wavy"
                        href="/admin/sponsor"
                    >
                        Modifica lista sponsor
                    </Link>
                </li>
                <li>
                    <Link
                        className="text-blue-600 underline underline-offset-4 hover:decoration-wavy"
                        href="/admin/activities"
                    >
                        Modifica lista attività
                    </Link>
                </li>
                <li>
                    <Link
                        className="text-blue-600 underline underline-offset-4 hover:decoration-wavy"
                        href="/admin/agenda"
                    >
                        Modifica agenda
                    </Link>
                </li>
            </ul>
        </div>
    );
}
