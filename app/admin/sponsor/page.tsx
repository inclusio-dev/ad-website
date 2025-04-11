"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import sponsors from "@/data/sponsors.json";

export default function SponsorManager() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        } else {
        }
    }, [router]);

    const levels = ["gold", "silver", "bronze"];

    const sortedSponsors = [...sponsors].sort(
        (a, b) => levels.indexOf(a.level) - levels.indexOf(b.level)
    );

    return (
        <div className="max-w-2xl mx-auto mt-12 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Area gestione sponsor</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {sortedSponsors.map((sponsor) => (
                    <div
                        key={sponsor.name}
                        className="flex flex-col items-center"
                    >
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="w-32 h-auto mb-2"
                        />
                        <p className="text-sm font-semibold">{sponsor.name}</p>
                        <span className="text-xs text-gray-500 capitalize">
                            {sponsor.level}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
