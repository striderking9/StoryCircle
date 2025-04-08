"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté pour éviter les erreurs d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? (
        // Icône de lune pour passer en mode sombre
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-8.66h1m-16.66 0h1M18.36 5.64l.7.7m-13.72 0l.7.7M18.36 18.36l.7-.7m-13.72 0l.7-.7M12 5a7 7 0 000 14 7 7 0 000-14z" />
        </svg>
      ) : (
        // Icône de soleil pour passer en mode clair
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v2m0 12v2m8-8h2M2 12H4m15.364-5.636l1.414 1.414M4.222 19.778l1.414-1.414m0-12.728L4.222 4.222m15.364 15.364l-1.414-1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )}
    </button>
  );
}
