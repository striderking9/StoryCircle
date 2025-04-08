"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // États pour le formulaire
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]); // pour la sélection de plusieurs images
  const [imageLink, setImageLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Gestion du changement de fichiers pour les images
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Fonction pour convertir un fichier en base64
  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Gestion de l'état de chargement de la session
  if (status === "loading") {
    return <p className="text-center py-4 text-gray-600">Chargement de la session…</p>;
  }
  if (!session) {
    return <p className="text-center py-4 text-gray-600">Vous devez être connecté pour créer un article.</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Par défaut, on utilise le lien d'image (s'il est renseigné)
    let imageData = imageLink;
    let imageUrls: string[] = [];
    // Si des fichiers ont été sélectionnés, on les convertit en base64
    if (files.length > 0) {
      try {
        imageUrls = await Promise.all(
          files.map((file) => convertFileToBase64(file) as Promise<string>)
        );
      } catch (error) {
        console.error("Erreur lors de la conversion d'images :", error);
      }
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      // Envoi d'un tableau d'images sous la clé "imageUrls"
      body: JSON.stringify({ title, content, imageUrls, videoUrl }),
    });
    if (res.ok) {
      router.push("/");
    } else {
      console.error("Erreur lors de la création de l'article");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Créer un article
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[200px]"
        />
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 dark:text-gray-300">
            Choisissez une ou plusieurs images :
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="text-gray-600 dark:text-gray-300"
          />
        </div>
        <input
          type="text"
          placeholder="Lien de l'image (optionnel)"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="URL de la vidéo (optionnel)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          Publier
        </button>
      </form>
    </div>
  );
}
