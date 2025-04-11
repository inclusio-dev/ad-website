"use client";

import React from "react";
import Image from "next/image";

type Sponsor = {
    name: string;
    logo: string;
    level: string;
};

interface SponsorListProps {
    sponsors: Sponsor[];
}

const levels = [
    "Patrocinio",
    "Deluxe",
    "Diamond",
    "Palladium",
    "Platinum",
    "Gold",
    "Silver",
    "Bronze",
    "Media",
];

export default function SponsorList({ sponsors }: SponsorListProps) {
    const sortedSponsors = [...sponsors].sort(
        (a, b) => levels.indexOf(a.level) - levels.indexOf(b.level)
    );

    return (
        <div className="space-y-8">
            {levels.map((level) => {
                const sponsorsAtThisLevel = sortedSponsors
                    .filter(
                        (sponsor) =>
                            sponsor.level.toLowerCase() === level.toLowerCase()
                    )
                    .sort((a, b) =>
                        a.name.localeCompare(b.name, "it", {
                            sensitivity: "base",
                        })
                    );

                if (sponsorsAtThisLevel.length === 0) return null;

                const isPatrocinio = level.toLowerCase() === "patrocinio";

                return (
                    <div key={level} className="space-y-4">
                        <div className={`border-b pb-1`}>
                            <h2 className="text-lg font-semibold">
                                {isPatrocinio
                                    ? "Con il patrocinio di"
                                    : `${level} sponsor`}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {sponsorsAtThisLevel.map((sponsor) => (
                                <div
                                    key={sponsor.name}
                                    className="flex flex-col items-center"
                                >
                                    <Image
                                        src={`/sponsors/${sponsor.logo}`}
                                        alt={sponsor.name}
                                        width={128} // larghezza in px, coerente con w-32
                                        height={0} // 0 per evitare forzature, gestiamo l'altezza con style
                                        className="mb-2"
                                        style={{ height: "auto" }}
                                        unoptimized // opzionale se stai caricando immagini esterne
                                    />

                                    <p className="text-base font-semibold">
                                        {sponsor.name}
                                    </p>
                                    <span className="text-sm text-gray-700 capitalize">
                                        {sponsor.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
