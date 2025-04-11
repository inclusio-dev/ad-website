"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import sponsorsJson from "@/data/sponsors.json";

export default function SponsorManager() {
    const router = useRouter();
    const [newSponsor, setNewSponsor] = useState({
        name: "",
        logo: "",
        level: "",
    });

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        } else {
        }
    }, [router]);

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

    const [sponsors, setSponsors] = useState([...sponsorsJson]);

    const sortedSponsors = [...sponsors].sort(
        (a, b) => levels.indexOf(a.level) - levels.indexOf(b.level)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSponsor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setNewSponsor((prev) => ({
                ...prev,
                logo: URL.createObjectURL(file),
            }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSponsor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Salva sul server via API
        const res = await fetch("/api/sponsors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newSponsor),
        });

        if (res.ok) {
            const result = await res.json();
            setSponsors((prev) => [...prev, result.sponsor]);
            setNewSponsor({ name: "", logo: "", level: "bronze" });
        } else {
            alert("Errore durante il salvataggio!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Area gestione sponsor</h1>

            <div>
                <div className="space-y-8">
                    {levels.map((level) => {
                        const sponsorsAtThisLevel = sortedSponsors.filter(
                            (sponsor) =>
                                sponsor.level.toLowerCase() ===
                                level.toLowerCase()
                        );

                        if (sponsorsAtThisLevel.length === 0) return null;

                        const isPatrocinio =
                            level.toLowerCase() === "patrocinio";

                        return (
                            <div key={level} className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-1">
                                    <h2 className="text-lg font-semibold">
                                        {isPatrocinio
                                            ? "Con il patrocinio di"
                                            : level + " sponsor"}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {sponsorsAtThisLevel.map((sponsor) => (
                                        <div
                                            key={sponsor.name}
                                            className="flex flex-col items-center"
                                        >
                                            <img
                                                src={sponsor.logo}
                                                alt={sponsor.name}
                                                className="w-32 h-auto mb-2"
                                            />
                                            <p className="text-sm font-semibold">
                                                {sponsor.name}
                                            </p>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {sponsor.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Form per aggiungere sponsor */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 p-4 border rounded"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Aggiungi un nuovo Sponsor
                    </h3>
                    <div className="mb-4">
                        <label className="block text-sm mb-2">
                            Nome Sponsor
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={newSponsor.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-2">
                            Logo Sponsor
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-2">
                            Livello Sponsor
                        </label>
                        <select
                            name="level"
                            value={newSponsor.level}
                            onChange={handleSelectChange} // Gestore per select
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="bronze">Bronze</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        Aggiungi Sponsor
                    </button>
                </form>
            </div>
        </div>
    );
}
