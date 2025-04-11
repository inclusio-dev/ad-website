"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Activity = {
    title: string;
    description: string;
    details: string[];
    image: string;
    ctaLink: string;
    ctaLabel: string;
};

export default function ActivityManager() {
    const router = useRouter();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState<Activity>({
        title: "",
        description: "",
        details: [],
        image: "",
        ctaLink: "",
        ctaLabel: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const detailsRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            router.push("/admin/login");
        }

        fetch("/api/activities")
            .then((res) => res.json())
            .then((data) => setActivities(data));
    }, [router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload-activity-image", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const { filename } = await res.json();
            setNewActivity((prev) => ({ ...prev, image: filename }));
        } else {
            alert("Errore upload immagine");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const details =
            detailsRef.current?.value
                .split("\n")
                .map((d) => d.trim())
                .filter(Boolean) || [];

        const body = JSON.stringify({ ...newActivity, details });

        const res = await fetch("/api/activities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if (res.ok) {
            const result = await res.json();
            setActivities((prev) => [...prev, result.activity]);
            setNewActivity({
                title: "",
                description: "",
                details: [],
                image: "",
                ctaLink: "",
                ctaLabel: "",
            });

            if (fileInputRef.current) fileInputRef.current.value = "";
            if (detailsRef.current) detailsRef.current.value = "";
        } else {
            alert("Errore salvataggio attività");
        }
    };

    const handleDelete = async (title: string) => {
        if (!confirm(`Eliminare "${title}"?`)) return;

        const res = await fetch(
            `/api/activities?title=${encodeURIComponent(title)}`,
            {
                method: "DELETE",
            }
        );

        if (res.ok) {
            setActivities((prev) => prev.filter((a) => a.title !== title));
        } else {
            alert("Errore eliminazione");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-6">
            <h1 className="text-2xl font-bold">Gestione Prossime Attività</h1>

            <form
                onSubmit={handleSubmit}
                className="border p-4 rounded space-y-4"
            >
                <div>
                    <label className="block mb-1 text-sm">
                        Titolo attività
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={newActivity.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Descrizione</label>
                    <textarea
                        name="description"
                        value={newActivity.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">
                        Indicazioni (una per riga)
                    </label>
                    <textarea
                        ref={detailsRef}
                        rows={3}
                        placeholder="es. 9 gennaio 2025\nore 18.00 - 19.00\nhttps://link..."
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">
                        Immagine di copertina
                    </label>
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
                        htmlFor="ctaLabel"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Testo del link (es. “Iscriviti”)
                    </label>
                    <input
                        type="text"
                        name="ctaLabel"
                        id="ctaLabel"
                        value={newActivity.ctaLabel || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Iscriviti al webinar"
                    />
                </div>

                <div className="block mb-1 text-sm">
                    <label
                        htmlFor="ctaLink"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Link utile (es. per iscrizione)
                    </label>
                    <input
                        type="url"
                        name="ctaLink"
                        id="ctaLink"
                        value={newActivity.ctaLink || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="https://..."
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Aggiungi Attività
                </button>
            </form>

            <div className="grid md:grid-cols-2 gap-6">
                {activities.map((a) => (
                    <div key={a.title} className="border rounded p-4">
                        <img
                            src={`/activities/${a.image}`}
                            alt={a.title}
                            className="w-full h-48 object-cover rounded mb-2"
                        />
                        <h3 className="text-xl font-semibold mb-1">
                            {a.title}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {a.description}
                        </p>
                        {Array.isArray(a.details) && a.details.length > 0 && (
                            <ul className="text-sm mb-2">
                                {a.details.map((d, i) => (
                                    <li key={i}>• {d}</li>
                                ))}
                            </ul>
                        )}

                        {a.ctaLink && a.ctaLabel && (
                            <a
                                href={a.ctaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-yellow-400"
                            >
                                {a.ctaLabel}
                            </a>
                        )}

                        <button
                            onClick={() => handleDelete(a.title)}
                            className="mt-2 text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Elimina
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
