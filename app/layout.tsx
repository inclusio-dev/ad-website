import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { ModeToggle } from "@/components/mode-toggle";
import { ChiSiamoDropdown } from "@/components/ChiSiamoDropdown"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Accessibility Days",
    description:
        "Il più grande evento italiano sull'Accessibilità e l'Inclusività delle tecnologie digitali.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="it-IT" suppressHydrationWarning>
            <body
                className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ${inter.className}`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="max-w-2xl mx-auto py-10 px-4">
                        <header>
                            <div className="flex items-center justify-between">
                                <ModeToggle />
                                <nav className="ml-auto text-sm font-medium space-x-6">
                                    <Link href="/">Home</Link>
                                    <ChiSiamoDropdown />
                                    <Link href="/agenda">Agenda</Link>
                                    <Link href="/sponsor">Sponsor</Link>
                                    <Link href="/location">Location</Link>
                                    <Link href="/contatti">Contattaci</Link>
                                </nav>
                            </div>
                        </header>
                        <main>{children}</main>
                    </div>
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
