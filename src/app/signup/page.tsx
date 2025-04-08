"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Gestion du changement de fichier pour la photo de profil
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Vérifier que tous les champs requis sont remplis et que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");

    // Créer un objet FormData pour gérer la photo de profil si elle est présente
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("telephone", telephone);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
        // Redirection après 2 secondes pour laisser le temps d'afficher le message de succès
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="p-8 bg-white dark:bg-gray-800 shadow rounded space-y-6 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          Créer un compte
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Prénom"
            className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom"
            className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Téléphone"
          className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="border p-3 w-full rounded dark:bg-gray-700 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div>
          <label className="block mb-2 text-gray-600 dark:text-gray-300">
            Photo de profil (facultatif)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-600 dark:text-gray-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded transition-colors"
        >
          S'inscrire
        </button>
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">
            Vous avez déjà un compte ?
          </span>
          <Link href="/signin" className="ml-2 text-blue-500 hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}
