"use client";

import Link from "next/link";


type Activity = {
    title: string;
    description: string;
    details: string[];
    image: string;
    ctaLink: string;
    ctaLabel: string;
};

interface ActivitiesListProps {
  items: Activity[];
}

export default function ActivitiesList({ items }: ActivitiesListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
                {items.map((a) => (
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
                                className="inline-block mt-2 text-sm underline font-medium text-blue-600 hover:underline dark:text-yellow-400"
                            >
                                {a.ctaLabel}
                            </a>
                        )}

                    </div>
                ))}
            </div>
  );
}
