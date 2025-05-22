// src/app/profile/edit/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // États pour les données du profil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données utilisateur depuis l'API lorsque la session est prête
  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/profile?email=${encodeURIComponent(session.user.email)}`);
          if (res.ok) {
            const data = await res.json();
            // Remplissage des états avec les données récupérées
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setTelephone(data.telephone || "");
            setBio(data.bio || "");
            setProfilePicPreview(data.profilePicture || "");
          } else {
            console.error("Erreur lors du chargement des données utilisateur");
          }
        } catch (err) {
          console.error("Erreur lors du fetch des données :", err);
        }
      }
    }
    fetchUserData();
  }, [session]);

  // Gestion du changement de fichier pour la photo de profil
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convertir un fichier en base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Soumission du formulaire d'édition du profil
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let profilePictureBase64 = profilePicPreview; // Utilise l'aperçu si existant
    if (profilePic) {
      try {
        profilePictureBase64 = await convertFileToBase64(profilePic);
      } catch (err) {
        console.error("Erreur lors de la conversion de l'image de profil :", err);
        setError("Erreur lors de l'upload de la photo de profil.");
        setIsSubmitting(false);
        return;
      }
    }

    const updatedData = {
      email: session?.user?.email, // Utilisation de l'email de la session
      firstName,
      lastName,
      telephone,
      bio,
      profilePicture: profilePictureBase64,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH", // ou PUT, selon votre implémentation côté API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        router.push("/profile"); // Redirection vers la page de profil
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la mise à jour du profil.");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Chargement...
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Vous devez être connecté pour modifier votre profil.
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Modifier le profil
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-2">
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Photo de profil" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                Pas d'image
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} className="text-gray-600 dark:text-gray-300" />
        </div>

        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Téléphone */}
        <input
          type="text"
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Biographie */}
        <textarea
          placeholder="Biographie (optionnel)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
        >
          Enregistrer
        </button>
      </form>
    </main>
  );
}
