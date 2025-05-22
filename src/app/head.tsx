// src/app/head.tsx
"use client";

import Script from "next/script";

export default function Head() {
  return (
    <>
      {/* Ce script tourne AVANT toute hydratation pour poser la classe */}
      <Script id="init-theme" strategy="beforeInteractive">
        {`
          (function() {
            try {
              const stored = localStorage.getItem('theme');
              const system = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
              const theme = stored || system;
              document.documentElement.classList.add(theme);
            } catch {}
          })();
        `}
      </Script>

      {/* Métas de base */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
    </>
  );
}
