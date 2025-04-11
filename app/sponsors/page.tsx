"use client";
import { useState } from "react";
import SponsorList from "@/components/SponsorList";
import sponsorsJson from "@/data/sponsors.json";

export default function Sponsors() {
    const [sponsors, setSponsors] = useState([...sponsorsJson]);
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
    const sortedSponsors = [...sponsors].sort(
        (a, b) => levels.indexOf(a.level) - levels.indexOf(b.level)
    );

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Area gestione sponsor</h1>
            <SponsorList sponsors={sponsors}></SponsorList>
        </div>
    );
}
