import path from "path";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AgendaSpeakerCard } from "@/components/AgendaSpeakerCard";

interface Speaker {
    id: number;
    first_name: string;
    last_name: string;
    job_title?: string;
    bio?: string;
    profile_picture_url?: string;
    social_linkedin_url?: string;
    social_facebook_url?: string;
    social_instagram_url?: string;
}

interface AgendaItem {
    id: number;
    title: string;
    description?: string;
    color?: string;
    location?: string;
    presenters?: string;
    tags?: string;
    speakers?: Speaker[];
}

interface EventPageProps {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), "data", "agenda.json");
    const json = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(json);

    const itemsWithId = data.data
        .flatMap((day: any) => day.events)
        .flatMap((event: any) => event.items)
        .filter((item: any) => item.id !== null);

    return itemsWithId.map((item: any) => ({
        id: String(item.id),
    }));
}

export default async function EventPage({ params }: EventPageProps) {
    const eventId = parseInt(params.id, 10);

    const filePath = path.join(process.cwd(), "data", "agenda.json");
    const json = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(json);

    const allItems = data.data.flatMap((day: any) => {
        return day.events.flatMap((event: any) => event.items);
    });

    let item = allItems.find((i: any) => i.id === eventId) as
        | AgendaItem
        | undefined;

    if (!item) {
        notFound();
    }

    // Trova il giorno (e tipo) che contiene l'evento
    let parentDay: any | undefined;
    let found = false;

    for (const day of data.data) {
        for (const timeSlot of day.events) {
            for (const entry of timeSlot.items) {
                if (entry.id === eventId) {
                    item = entry;
                    parentDay = day;
                    found = true;
                    break;
                }
            }
        }
        if (found) break;
    }

    if (!item || !parentDay) {
        notFound();
    }

    const returnUrl = `/agenda/${
        parentDay.label.toLowerCase().includes("workshop")
            ? "workshop"
            : "sessioni"
    }/${parentDay.slug}`;

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-3xl mx-auto">
                <Link
                    href={returnUrl}
                    className="text-blue-600 mb-6 inline-block"
                >
                    ← Torna all&apos;agenda
                </Link>

                <h1 className="text-4xl font-bold mb-4">{item.title}</h1>

                {item.location && (
                    <p className="text-gray-600 mb-2">
                        <strong>📍 Location:</strong> {item.location}
                    </p>
                )}

                {item.presenters && (
                    <p className="text-gray-600 mb-4">
                        <strong>🎤 Speaker:</strong> {item.presenters}
                    </p>
                )}

                {item.description && (
                    <p className="text-gray-800 whitespace-pre-line mb-6">
                        {item.description}
                    </p>
                )}

                {item.tags && (
                    <div className="mt-6">
                        <strong className="text-gray-500 block mb-1">
                            Tag:
                        </strong>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(item.tags)
                                ? item.tags
                                : item.tags.split(",")
                            ).map((tag: string) => {
                                const clean = tag
                                    .trim()
                                    .toLowerCase()
                                    .replace(/\s+/g, "-");
                                return (
                                    <Link
                                        key={clean}
                                        href={`/agenda/tag/${clean}`}
                                        className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition"
                                    >
                                        #{tag.trim()}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {item.speakers && item.speakers.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold mt-16 mb-6">
                            Speaker
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {item.speakers.map((speaker) => (
                                <AgendaSpeakerCard
                                    key={speaker.id}
                                    speaker={speaker}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
