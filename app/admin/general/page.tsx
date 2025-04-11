"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContentManager() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        }
    }, [router]);

    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Area di gestione contenuti
                </h1>
                <p className="mt-2 text-gray-600 text-sm">
                    Seleziona una sezione da modificare.
                </p>
            </header>

            <nav aria-label="Sezioni amministrazione contenuti">
                <ul className="space-y-4">
                    {[
                        {
                            href: "/admin/pages",
                            label: "Modifica pagine sito",
                        },
                        {
                            href: "/admin/sponsor",
                            label: "Modifica lista sponsor",
                        },
                        {
                            href: "/admin/activities",
                            label: "Modifica lista attività",
                        },
                        {
                            href: "/admin/agenda",
                            label: "Modifica agenda",
                        },
                    ].map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="block px-4 py-3 rounded-md border border-gray-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-blue-700 font-medium transition-all"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </main>
    );
}
