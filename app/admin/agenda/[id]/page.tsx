"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminSessionPage() {
    const { id } = useParams();
    const searchParams = useSearchParams(); // ✅ QUI
    const startFromQuery = searchParams.get("start") ?? "";
    const router = useRouter();

    const [session, setSession] = useState<any>(null);
    const [form, setForm] = useState({
        title: "",
        abstract: "",
        start: "",
        location: "",
        level: "",
        tags: [] as string[],
        speakers: [] as {
            first_name: string;
            last_name: string;
            job_title: string;
            organization: string;
            image: string;
            website: string;
            linkedin: string;
            facebook: string;
            instagram: string;
            bio: string;
        }[],
    });

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const startFromQuery = searchParams.get("start");

        const fetchSession = async () => {
            try {
                const res = await fetch(`/api/agenda/${id}`);
                if (!res.ok) throw new Error("Errore caricamento sessione");
                const data = await res.json();

                setSession(data.session);

                // ✅ Se start mancante, prova a prenderlo da data.session.start o da fallback
                setForm({
                    title: data.session.title ?? "",
                    abstract: data.session.abstract ?? "",
                    start: data.session.start || startFromQuery || "", // ✅ fallback con query
                    location: data.session.location ?? "",
                    level: data.session.level ?? "",
                    tags: Array.isArray(data.session.tags)
                        ? data.session.tags
                        : [],
                    speakers: Array.isArray(data.session.speakers)
                        ? data.session.speakers.map((s: any) => ({
                              first_name: s.first_name ?? "",
                              last_name: s.last_name ?? "",
                              job_title: s.job_title ?? "",
                              organization: s.organization ?? "",
                              image: s.image ?? "",
                              website: s.website ?? "",
                              linkedin: s.linkedin ?? "",
                              facebook: s.facebook ?? "",
                              instagram: s.instagram ?? "",
                              bio: s.bio ?? "",
                          }))
                        : [],
                });
            } catch (err) {
                console.error("Errore fetch sessione:", err);
            }
        };

        if (id) fetchSession();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleTagsChange = (value: string) => {
        setForm({ ...form, tags: value.split(",").map((tag) => tag.trim()) });
    };

    const handleSpeakerChange = (index: number, key: string, value: string) => {
        const updated = [...form.speakers];
        updated[index][key as keyof (typeof updated)[number]] = value;
        setForm({ ...form, speakers: updated });
    };

    const handleImageUpload = async (index: number, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload/speaker", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.filename) {
                const updated = [...form.speakers];
                updated[index].image = data.filename;
                setForm({ ...form, speakers: updated });
            }
        } catch (err) {
            console.error("Errore upload immagine:", err);
        }
    };

    const handleAddSpeaker = () => {
        setForm({
            ...form,
            speakers: [
                ...form.speakers,
                {
                    first_name: "",
                    last_name: "",
                    job_title: "",
                    organization: "",
                    image: "",
                    website: "",
                    linkedin: "",
                    facebook: "",
                    instagram: "",
                    bio: "",
                },
            ],
        });
    };

    const validateForm = () => {
        const errs: string[] = [];
        if (!form.title.trim()) errs.push("Il titolo è obbligatorio");
        if (!form.location.trim()) errs.push("La location è obbligatoria");
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            console.log("Form non valido:", form);
            return;
        }

        try {
            setSaving(true);
            console.log("Invio dati:", form);

            const res = await fetch(`/api/agenda/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Errore risposta:", errText);
                throw new Error("Errore salvataggio");
            }

            console.log("Dati salvati con successo!");
            router.push("/admin/agenda");
        } catch (err) {
            console.error("Errore nel salvataggio:", err);
        } finally {
            setSaving(false);
        }
    };

    if (!session) return <p className="p-8">Caricamento sessione...</p>;

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto space-y-10">
                <Link
                    href="/admin/agenda"
                    className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                    >
                    ← Torna all’elenco sessioni
                </Link>

                <h1 className="text-4xl font-bold mb-2">{session.title}</h1>
                <p className="text-lg text-gray-600">
                    {new Date(session.date).toLocaleDateString("it-IT", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    — {session.start} presso {session.location}
                </p>

                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 rounded">
                        <ul className="list-disc list-inside space-y-1">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Dettagli</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Titolo sessione"
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            name="abstract"
                            value={form.abstract}
                            onChange={handleChange}
                            placeholder="Abstract sessione"
                            className="w-full p-2 border rounded"
                            rows={4}
                        />
                        <input
                            name="start"
                            value={form.start}
                            disabled
                            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed text-gray-700"
                        />

                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Luogo"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                            placeholder="Livello sessione (es. base, intermedio, avanzato)"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            name="tags"
                            value={form.tags.join(", ")}
                            onChange={(e) => handleTagsChange(e.target.value)}
                            placeholder="Tag separati da virgola"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Speaker</h2>
                        <button
                            onClick={handleAddSpeaker}
                            className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                            + Aggiungi speaker
                        </button>
                    </div>

                    {form.speakers.map((speaker, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded bg-gray-50 space-y-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={speaker.first_name}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "first_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Cognome"
                                    value={speaker.last_name}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "last_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Ruolo professionale"
                                    value={speaker.job_title}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "job_title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Organizzazione"
                                    value={speaker.organization}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "organization",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Sito web"
                                    value={speaker.website}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="LinkedIn"
                                    value={speaker.linkedin}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "linkedin",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Facebook"
                                    value={speaker.facebook}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "facebook",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Instagram"
                                    value={speaker.instagram}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "instagram",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                />
                                <textarea
                                    placeholder="Bio"
                                    value={speaker.bio}
                                    onChange={(e) =>
                                        handleSpeakerChange(
                                            index,
                                            "bio",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 border rounded col-span-full"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Foto speaker
  </label>

  {speaker.image ? (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-xs text-gray-500 mb-1">Foto attuale:</p>
        <Image
          src={`/speakers/${speaker.image}`}
          alt={speaker.first_name}
          width={96}
          height={96}
          className="rounded object-cover border"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm text-gray-700 mb-1">Carica nuova foto:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageUpload(index, e.target.files[0]);
            }
          }}
          className="w-full text-sm"
        />
      </div>
    </div>
  ) : (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleImageUpload(index, e.target.files[0]);
        }
      }}
      className="w-full"
    />
  )}
</div>


                            
                        </div>
                    ))}
                </section>

                <div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Salvataggio..." : "Salva modifiche"}
                    </button>
                </div>
            </div>
        </div>
    );
}
