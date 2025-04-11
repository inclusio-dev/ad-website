"use client";

import Image from "next/image";
import Link from "next/link";
import SponsorList from "@/components/SponsorList";
import sponsorsJson from "@/data/sponsors.json";
import activities from "@/data/upcoming-activities.json";
import ActivitiesList from "@/components/ActivitiesList";

export default function Home() {
    const filteredSponsors = sponsorsJson.filter(
        (sponsor) =>
            sponsor.level.toLowerCase() === "patrocinio" ||
            sponsor.level.toLowerCase() === "deluxe"
    );
    return (
        <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Hero Section */}
            <section className="bg-[#FFD100] rounded-xl px-6 py-12 md:py-20 md:px-10 max-w-7xl mx-auto my-12">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Colonna sinistra - Testi */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-3">
                            Accessibility Days
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">
                            Il digitale che accoglie
                        </h2>
                        <p className="text-lg text-black font-medium mb-1">
                            15 e 16 Maggio 2025
                        </p>
                        <p className="text-lg text-black font-medium mb-6">
                            Istituto dei Ciechi di Milano
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                href="/agenda"
                                className="px-6 py-3 bg-white text-black border border-black text-base font-semibold rounded-md hover:bg-gray-100 transition"
                            >
                                Vai all&apos;agenda
                            </Link>
                            <Link
                                href="/iscrizione"
                                className="px-6 py-3 bg-black text-white text-base font-semibold rounded-md hover:bg-gray-900 transition"
                            >
                                Iscriviti
                            </Link>
                        </div>
                    </div>

                    {/* Colonna destra - Immagine */}
                    <div className="md:w-1/2">
                        <Image
                            src="/assets/img-hero.webp"
                            alt="Persone che alzano le mani"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto shadow-md"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-white dark:bg-gray-900 px-6 md:px-10 py-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* Colonna sinistra: Titolo e testo */}
                    <div className="md:w-3/4">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
                            Cos’è Accessibility Days?
                        </h2>
                        <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
                            Accessibility Days è un evento sull’Accessibilità e
                            sulle Disabilità rivolto a sviluppatori, designer,
                            maker, creatori ed editori di contenuti, ed in
                            generale a tutte le persone che si occupano di
                            tecnologie digitali. Compresa anche la Didattica a
                            Distanza, argomento della massima importanza in
                            questo periodo.
                            <br />
                            <br />
                            Si terrà in occasione del{" "}
                            <strong>
                                Global Accessibility Awareness Day (GAAD)
                            </strong>
                            , manifestazione promossa ogni anno a livello
                            mondiale, nel mese di maggio, per sensibilizzare chi
                            si occupa di tecnologie digitali sul tema
                            dell’accessibilità e dell’inclusività, attraverso il
                            confronto e l’interazione di persone con disabilità.
                        </p>
                    </div>

                    {/* Colonna destra: Logo GAAD */}
                    <div className="md:w-1/4 flex justify-center md:justify-end">
                        <Image
                            src="/assets/gaad-full-text-logo-navy.svg" // inserisci il logo GAAD nella public/logos/
                            alt="Logo Global Accessibility Awareness Day"
                            width={160}
                            height={160}
                            className="w-auto h-24 md:h-32 object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Donazioni */}
            <section className="bg-white dark:bg-gray-900 px-6 md:px-10 py-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                    {/* Colonna sinistra: box giallo */}
                    <div className="md:w-1/3 bg-[#FFD100] rounded-lg px-6 py-8 text-black shadow-md">
                        <h3 className="text-2xl font-bold mb-2">
                            Fai una donazione
                        </h3>
                        <p className="text-base font-medium leading-relaxed">
                            Aiutaci a sostenere i costi dell’evento
                        </p>
                    </div>

                    {/* Colonna destra: descrizione + bottoni */}
                    <div className="md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                            Accessibility Days è un’organizzazione no profit
                        </h3>
                        <p className="text-base text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
                            Un evento del genere richiede però molte spese,
                            soprattutto se si vuole assicurare ai partecipanti
                            un’esperienza completa e soddisfacente (anche in
                            termini di accessibilità), e nonostante il supporto
                            dei volontari che ci danno una mano, per alcuni
                            servizi dobbiamo rivolgerci a dei professionisti.
                            <br />
                            <br />
                            Solo grazie alle donazioni e alle sponsorizzazioni
                            possiamo raggiungere gli obiettivi prefissati,
                            potendo così organizzare un evento di qualità e
                            realmente inclusivo!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/donazione"
                                className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-900 transition"
                            >
                                Fai una donazione
                            </Link>
                            <Link
                                href="/sponsorizza"
                                className="px-6 py-3 bg-white text-black border border-black font-semibold rounded-md hover:bg-gray-100 transition"
                            >
                                Sponsorizza Accessibility Days
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Come Funziona Section */}
            <section className="bg-white dark:bg-gray-900 px-6 md:px-10 py-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Colonna sinistra: immagine */}
                    <div className="md:w-1/2">
                        <Image
                            src="/assets/workshop_accessibility_days_2024-1536x864.webp" // Assicurati che questa immagine sia presente nella cartella /public/images/
                            alt="Persone che partecipano all'evento"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto shadow-md"
                            priority
                        />
                    </div>

                    {/* Colonna destra: step numerati */}
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
                            Come funziona
                        </h2>
                        <ol className="space-y-6">
                            <li className="flex items-start">
                                <span className="text-2xl font-bold text-[#FFD100] mr-4">
                                    1
                                </span>
                                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                                    Partecipa alle sessioni e ai workshop per
                                    approfondire le tematiche
                                    dell'accessibilità.
                                </p>
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl font-bold text-[#FFD100] mr-4">
                                    2
                                </span>
                                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                                    Scopri le ultime novità e best practice per
                                    rendere il digitale più inclusivo.
                                </p>
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl font-bold text-[#FFD100] mr-4">
                                    3
                                </span>
                                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                                    Connettiti con professionisti e appassionati
                                    del settore per condividere esperienze e
                                    conoscenze.
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* RoadTo Section */}
            <section className="py-16 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-left">
                    <div className="text-left mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                            Road to Accessibility Days
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                            Notizie, approfondimenti e articoli per avvicinarsi
                            al mondo dell’accessibilità.
                        </p>
                    </div>
                    <ActivitiesList items={activities} />
                </div>
            </section>


            {/* Sponsor Section */}
            <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-800 transition-colors">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Con il patrocinio e i main sponsor
                    </h2>
                    <SponsorList sponsors={filteredSponsors} />
                </div>
            </section>

            {/* Contatti Section */}
            <section className="py-16 px-4 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Contattaci</h2>
                    <p className="text-lg mb-6">
                        Per informazioni, partnership o richieste speciali
                        contattaci senza esitazioni.
                    </p>
                    <Link
                        href="/contatti"
                        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition"
                    >
                        Scrivici
                    </Link>
                </div>
            </section>
        </main>
    );
}
