"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    // Utilisation de min-h-screen pour occuper toute la hauteur, et overflow-hidden pour ne pas défiler
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <form
        onSubmit={handleSignIn}
        className="p-8 bg-white dark:bg-gray-800 shadow rounded space-y-4 w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Connexion</h1>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Se connecter
        </button>
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">
            Vous n'avez pas de compte ?
          </span>
          <Link href="/signup" className="ml-2 text-blue-500 hover:underline">
            Créer un compte
          </Link>
        </div>
      </form>
    </div>
  );
}
