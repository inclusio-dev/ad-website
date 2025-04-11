"use client";

import { useState } from "react";

export default function ContattiPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
        aria-describedby="form-description"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contatti</h1>

        <p className="text-sm text-gray-600 mb-4" id="form-description">
          Tutti i campi contrassegnati con{" "}
          <span aria-hidden="true" className="text-red-600 font-bold">
            *
          </span>{" "}
          sono obbligatori.
        </p>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-800"
          >
            Nome{" "}
            <span className="text-red-600 font-bold" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800"
          >
            Email{" "}
            <span className="text-red-600 font-bold" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-800"
          >
            Messaggio{" "}
            <span className="text-red-600 font-bold" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full mt-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Invia messaggio
        </button>

        {submitted && (
          <p role="status" className="text-green-700 font-semibold mt-2">
            ✅ Messaggio inviato con successo!
          </p>
        )}
      </form>

      {/* Info contatto */}
      <aside className="bg-gray-50 p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          Hai bisogno di parlare con noi?
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Se preferisci contattarci telefonicamente, siamo disponibili dal lunedì
          al venerdì dalle 9:00 alle 18:00.
        </p>
        <p className="text-lg font-bold text-blue-700">
          📞{" "}
          <a
            href="tel:+390712345678"
            className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            071 234 5678
          </a>
        </p>
      </aside>
    </main>
  );
}
