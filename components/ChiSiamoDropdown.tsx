'use client'

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export function ChiSiamoDropdown() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        id="chi-siamo-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="chi-siamo-menu"
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 px-2 py-1"
      >
        Chi siamo
        <span aria-hidden="true" className="ml-1">▾</span>
      </button>

      {open && (
        <div
          id="chi-siamo-menu"
          role="menu"
          aria-labelledby="chi-siamo-button"
          className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-slate-800 border dark:border-slate-700 z-10"
        >
          <div className="py-1" role="none">
            <Link
              href="/chi-siamo/cosa-sono"
              role="menuitem"
              className="block px-4 py-2 text-sm whitespace-nowrap text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
            >
              Cosa sono gli Accessibility Days
            </Link>
            <Link
              href="/chi-siamo/come-nascono"
              role="menuitem"
              className="block px-4 py-2 text-sm whitespace-nowrap text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
            >
              Come nascono gli Accessibility Days
            </Link>
            <Link
              href="/chi-siamo/associazione"
              role="menuitem"
              className="block px-4 py-2 text-sm whitespace-nowrap text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
            >
              Associazione
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
