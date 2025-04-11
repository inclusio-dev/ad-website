"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import sponsorsJson from "@/data/sponsors.json";

type Sponsor = {
    name: string;
    logo: string;
    level: string;
};

function normalizeFilename(originalName: string): string {
    return originalName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")        // spazi → trattini
      .replace(/[àáâä]/g, "a")     // accenti comuni
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[^a-z0-9.-]/g, ""); // rimuove simboli strani
  }
  

export default function SponsorManager() {
    const router = useRouter();
    const [sponsors, setSponsors] = useState<Sponsor[]>([...sponsorsJson]);
    const [newSponsor, setNewSponsor] = useState<Sponsor>({
        name: "",
        logo: "",
        level: "",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        }
    }, [router]);

    const sortedSponsors = [...sponsors].sort((a, b) => {
        const indexA = levels.indexOf(a.level);
        const indexB = levels.indexOf(b.level);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSponsor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
      
        const formData = new FormData();
        formData.append("file", file);
      
        const res = await fetch("/api/upload-logo", {
          method: "POST",
          body: formData,
        });
      
        if (res.ok) {
          const { filename } = await res.json();
      
          setNewSponsor((prev) => ({
            ...prev,
            logo: filename, // salva solo il nome nel JSON
          }));
        } else {
          alert("Errore durante l’upload del logo.");
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
            setNewSponsor({ name: "", logo: "", level: "" });
        } else {
            alert("Errore durante il salvataggio!");
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteSponsor = async (name: string) => {
        const confirmed = confirm(`Sei sicura di voler rimuovere "${name}"?`);
        if (!confirmed) return;

        const res = await fetch(
            `/api/sponsors?name=${encodeURIComponent(name)}`,
            {
                method: "DELETE",
            }
        );

        if (res.ok) {
            setSponsors((prev) => prev.filter((s) => s.name !== name));
        } else {
            alert("Errore durante l'eliminazione dello sponsor.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Area gestione sponsor</h1>

            <div className="space-y-8">
                {levels.map((level) => {
                    const sponsorsAtThisLevel = sortedSponsors
                        .filter(
                            (sponsor) =>
                                sponsor.level &&
                                sponsor.level.toLowerCase() ===
                                    level.toLowerCase()
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
                            <div className="border-b pb-1">
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
                                        <img
                                            src={`/sponsors/${sponsor.logo}`}
                                            alt={sponsor.name}
                                            className="w-32 h-auto mb-2"
                                        />
                                        <p className="text-base font-semibold">
                                            {sponsor.name}
                                        </p>
                                        <span className="text-sm text-gray-700 capitalize">
                                            {sponsor.level}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleDeleteSponsor(
                                                    sponsor.name
                                                )
                                            }
                                            className="mt-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            aria-label={`Elimina sponsor ${sponsor.name}`}
                                        >
                                            Elimina
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-4">
                    Aggiungi un nuovo Sponsor
                </h3>

                <div className="mb-4">
                    <label className="block text-sm mb-2">Nome Sponsor</label>
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
                    <label className="block text-sm mb-2">Logo Sponsor</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="level"
                        className="block text-sm mb-2 font-medium text-gray-900"
                    >
                        Livello Sponsor{" "}
                        <span className="sr-only">(campo obbligatorio)</span>
                    </label>

                    <select
                        id="level"
                        name="level"
                        value={newSponsor.level}
                        onChange={handleSelectChange}
                        className="w-full p-2 border rounded text-base"
                        required
                    >
                        <option value="" disabled hidden>
                            Seleziona un livello...
                        </option>
                        {levels.map((level, index) => (
                            <option key={index} value={level}>
                                {level}
                            </option>
                        ))}
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
    );
}
