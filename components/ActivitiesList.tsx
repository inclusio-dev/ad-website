"use client";

import Link from "next/link";

type Activity = {
    title: string;
    description: string;
    date?: string;
    link: string;
    linkLabel?: string;
};

interface ActivitiesListProps {
    items: Activity[];
}

export default function ActivitiesList({ items }: ActivitiesListProps) {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            {items.map((activity, index) => (
                <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 flex flex-col justify-between"
                >
                    <div>
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                            {activity.title}
                        </h3>
                        {activity.date && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {activity.date}
                            </p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            {activity.description}
                        </p>
                    </div>

                    <Link
                        href={activity.link}
                        className="inline-block mt-auto px-4 py-2 border border-black text-black dark:text-white dark:border-white font-semibold rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-center"
                        aria-label={`Scopri di più su "${activity.title}"`}
                    >
                        {activity.linkLabel ?? "Scopri di più"}
                    </Link>
                </div>
            ))}
        </div>
    );
}
