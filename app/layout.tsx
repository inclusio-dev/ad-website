import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { ModeToggle } from "@/components/mode-toggle";
import { ChiSiamoDropdown } from "@/components/ChiSiamoDropdown";
import { Montserrat } from "next/font/google";
import { MainMenu } from "@/components/MainMenu";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-montserrat",
});

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
        <html
            lang="it-IT"
            className={`${montserrat.variable}`}
            suppressHydrationWarning
        >
            <body
                className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans ${inter.className}`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="max-w-6xl mx-auto py-10 px-4">
                        <header className="mb-8 flex justify-end">
                            <div className="flex items-center justify-between">
                                <MainMenu />
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
