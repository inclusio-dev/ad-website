"use client";

import Link from "next/link";
import { useState } from "react";
import { ChiSiamoDropdown } from "./ChiSiamoDropdown";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";

export function MainMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop */}
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link href="/">Home</Link>
        <ChiSiamoDropdown />
        <Link href="/agenda">Agenda</Link>
        <Link href="/sponsors">Sponsor</Link>
        <Link href="/location">Location</Link>
        <Link href="/contatti">Contattaci</Link>
        <ModeToggle />
      </div>

      {/* Mobile button */}
      <div className="md:hidden flex items-center justify-between">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Apri menu mobile"
          className="p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white dark:bg-slate-950 shadow-md z-50 border-t dark:border-slate-800 p-4 space-y-3 text-sm font-medium md:hidden"
          aria-label="Menu di navigazione mobile"
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            Home
          </Link>
          <ChiSiamoDropdown />
          <Link
            href="/agenda"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            Agenda
          </Link>
          <Link
            href="/sponsors"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            Sponsor
          </Link>
          <Link
            href="/location"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            Location
          </Link>
          <Link
            href="/contatti"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            Contattaci
          </Link>
        </div>
      )}
    </nav>
  );
}
