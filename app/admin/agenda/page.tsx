"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

function hexToRgba(hex: string, opacity = 0.1) {
    const normalizedHex = hex.replace("#", "");
    const bigint = parseInt(normalizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function AdminAgendaPage() {
    const [agenda, setAgenda] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const fetchData = async () => {
            try {
                const res = await fetch("/api/agenda");
                const data = await res.json();
                setAgenda(data);
            } catch (err) {
                console.error("Errore fetch agenda:", err);
            }
        };
        fetchData();
    }, []);

    if (!isClient) return null;

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Gestione agenda</h1>

                {agenda.map((day) => (
                    <div key={day.id} className="mb-12">
                        <h2 className="text-2xl font-semibold mb-1">
                            {day.label}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {new Date(day.date).toLocaleDateString("it-IT", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        {day.events.map((slot: any, index: number) => (
                            <div key={index} className="mb-8 border-b pb-6">
                                <h3 className="text-xl font-medium mb-4">
                                    {slot.start}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {slot.items.map(
                                        (item: any, itemIndex: number) => (
                                            <div
                                                key={itemIndex}
                                                className="p-4 bg-white rounded-md shadow-sm hover:shadow transition"
                                                style={{
                                                    borderLeft: `5px solid ${
                                                        item.color || "#808080"
                                                    }`,
                                                    backgroundColor: hexToRgba(
                                                        item.color || "#808080",
                                                        0.08
                                                    ),
                                                }}
                                            >
                                                <Link
                                                    href={`/admin/agenda/event/${item.id}`}
                                                >
                                                    <h4 className="text-lg font-semibold mb-1">
                                                        {item.title}
                                                    </h4>
                                                </Link>

                                                {item.location && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <MapPin
                                                            className="inline w-4 h-4 mr-1"
                                                            aria-hidden="true"
                                                        />
                                                        {item.location}
                                                    </p>
                                                )}

                                                {item.description && (
                                                    <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                                                        {item.description}
                                                    </p>
                                                )}

                                                {item.speakers?.length > 0 && (
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        <strong>
                                                            Speaker:
                                                        </strong>{" "}
                                                        {item.speakers
                                                            .map(
                                                                (s: any) =>
                                                                    `${s.first_name} ${s.last_name}`
                                                            )
                                                            .join(", ")}
                                                    </p>
                                                )}

                                                {item.id && (
                                                    <Link
                                                        href={`/admin/agenda/${item.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Modifica sessione →
                                                    </Link>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
