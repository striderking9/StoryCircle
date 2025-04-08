"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useState } from "react";

export default function CreateArticlePage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
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
  const [savedContent, setSavedContent] = useState(""); // optionnel: pour sauvegarder temporairement le contenu
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour insérer une image dans l'éditeur
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Insertion de l'image au curseur actuel
      editor?.chain().focus().setImage({ src: base64 }).run();
    };
    reader.onerror = (error) => {
      console.error("Erreur lors de l'upload de l'image :", error);
      setUploadError("Erreur lors de l'upload de l'image.");
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const contentHtml = editor?.getHTML() || "";
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content: contentHtml,
          videoUrl,
        }),
      });
      if (res.ok) {
        // Redirection vers l'accueil après publication
        window.location.href = "/";
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
        {/* Barre d'outils personnalisée */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Underline
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ordered List
          </button>
          <button
            type="button"
            onClick={() => {
              // Insertion d'un lien : prompt simple
              const url = prompt("Entrez l'URL du lien:");
              if (url) {
                editor?.chain().focus().setLink({ href: url }).run();
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Link
          </button>
        </div>
        {/* Éditeur Tiptap */}
        <div className="border border-gray-300 rounded dark:border-gray-600">
          <EditorContent editor={editor} className="p-4 min-h-[200px] dark:bg-gray-700 dark:text-white" />
        </div>
        {/* Input pour l'upload d'image (permet d'ajouter des images inline) */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 dark:text-gray-300">
            Insérer une image :
          </label>
          <input
            type="file"
            accept="image/*"
            multiple={false}
            onChange={handleImageUpload}
            className="text-gray-600 dark:text-gray-300"
          />
          {uploadError && <p className="text-red-500">{uploadError}</p>}
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
