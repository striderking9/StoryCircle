"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          Mon Blog
        </Link>

        {/* Navigation desktop (visible à partir de sm) */}
        <nav className="hidden sm:flex space-x-6 items-center relative">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Accueil
          </Link>

          {session ? (
            <>
              <Link
                href="/create-article"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Créer un article
              </Link>

              {/* Zone de l'utilisateur avec dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center focus:outline-none"
                  aria-label="Menu utilisateur"
                >
                  {session.user?.firstName && session.user.firstName.trim() !== "" ? (
                    <span className="text-gray-800 dark:text-white">
                        {session.user.firstName}
                    </span>
                    ) : (
                    <span className="text-gray-600 dark:text-gray-300">
                        Profil
                    </span>
                    )}

                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  ) : null}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded shadow-lg z-10">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/signin"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Se connecter
            </Link>
          )}
          <DarkModeToggle />
        </nav>

        {/* Bouton hamburger (visible uniquement en dessous de sm) */}
        <div className="sm:hidden flex items-center">
          <DarkModeToggle />
          <button
            onClick={toggleMobileMenu}
            className="ml-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant qui pousse le contenu */}
      {isMobileMenuOpen && (
        <nav className="sm:hidden bg-white dark:bg-gray-800">
          <ul className="container mx-auto px-4 py-2 space-y-2">
            <li>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Accueil
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link
                    href="/create-article"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  >
                    Créer un article
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                >
                  Se connecter
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
