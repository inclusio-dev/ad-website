"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageMeta {
  slug: string;
  title: string;
}

export default function PagesList() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
    } else {
      fetch("/api/pages")
        .then((res) => res.json())
        .then((data) => {
          setPages(
            data.map((p: any) => ({ slug: p.slug, title: p.title }))
          );
        });
    }
  }, [router]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Pagine modificabili
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Seleziona una pagina da modificare.
        </p>
      </header>

      <section aria-label="Lista pagine modificabili">
        <ul className="space-y-3" role="list">
          {pages.map((page) => (
            <li key={`${page.slug}-${page.title}`}>
              <button
                onClick={() =>
                  router.push(`/admin/pages/edit/${page.slug}`)
                }
                className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-blue-700 font-medium transition-all"
              >
                ✏️ {page.title}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
