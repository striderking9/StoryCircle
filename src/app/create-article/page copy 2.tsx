"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
  const router = useRouter();

  // Initialisation de l'éditeur Tiptap pour le contenu riche
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
        autolink: false,
        linkOnPaste: false,
      }),
      Image,
    ],
    content: `<p>Commencez à rédiger votre article ici...</p>`,
  });

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State pour l'image de couverture (cover image) du post
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Gestion du changement de fichier pour l'image de couverture
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Fonction pour convertir un fichier en base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Récupérer le contenu HTML généré par Tiptap
    const contentHtml = editor?.getHTML() || "";
    let coverImageBase64 = "";
    if (coverImage) {
      try {
        coverImageBase64 = await convertFileToBase64(coverImage);
      } catch (error) {
        console.error("Erreur lors de la conversion de l'image de couverture :", error);
        setUploadError("Erreur lors de l'upload de l'image de couverture.");
      }
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content: contentHtml, // Contenu riche au format HTML
          imageUrl: coverImageBase64 || null, // Image de couverture
          videoUrl,
        }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Erreur lors de la création de l'article");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
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

        {/* Input pour l'image de couverture du post */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 dark:text-gray-300">
            Image de couverture :
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="text-gray-600 dark:text-gray-300"
          />
          {uploadError && <p className="text-red-500">{uploadError}</p>}
        </div>

        {/* Éditeur Tiptap pour le contenu riche */}
        <div className="border border-gray-300 rounded dark:border-gray-600">
          <EditorContent editor={editor} className="p-4 min-h-[200px] dark:bg-gray-700 dark:text-white" />
        </div>

        <input
          type="text"
          placeholder="URL de la vidéo (optionnel)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
        >
          Publier
        </button>
      </form>
    </div>
  );
}
