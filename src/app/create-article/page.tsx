"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function CreateArticlePage() {
  const router = useRouter();

  // helper File → Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result as string);
      reader.onerror = (e) => rej(e);
    });

  // 📚 l’éditeur
  const editor = useEditor({
    extensions: [
      StarterKit,                 // paragraphe, titres, listes, etc.
      HardBreak,                  // support des retours à la ligne
      Placeholder.configure({     // placeholder intégré
        placeholder: "Commencez à rédiger votre article ici…",
      }),
      Underline,                  // <u>
      LinkExtension.configure({   // gestion des liens
        autolink: false,
        linkOnPaste: false,
      }),
      Image,                      // insertion inline d’images
    ],
    content: "",                  // on démarre vide
    editorProps: {
      attributes: {
        class:
          "ProseMirror p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none",
      },
    },
  });

  // états du form
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // cover image
  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(file);
  };

  // inline image
  const onImageInline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.onerror = () => setError("Impossible d’insérer l’image inline.");
  };

  // submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    setIsSubmitting(true);
    setError("");

    try {
      const contentHtml = editor.getHTML();

      let coverBase64: string | null = null;
      if (coverImage) {
        coverBase64 = await toBase64(coverImage);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content: contentHtml,
          imageUrl: coverBase64,
          videoUrl: videoUrl || null,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Publication échouée");
      }

      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur pendant la publication");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-extrabold text-center">Créer un article</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* TITRE */}
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* IMAGE DE COUVERTURE */}
        <div>
          <label className="block mb-1 font-medium">Image de couverture :</label>
          <input
            type="file"
            accept="image/*"
            onChange={onCoverChange}
            className="text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* BARRE D’OUTILS */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            1. Liste
          </button>
          <button
            type="button"
            onClick={() => {
              const href = prompt("URL du lien :");
              if (href) editor.chain().focus().setLink({ href }).run();
            }}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
          >
            🔗
          </button>
        </div>

        {/* ÉDITEUR RICHE */}
        <div className="border rounded-lg">
          <EditorContent editor={editor} />
        </div>

        {/* IMAGE INLINE */}
        <div>
          <label className="block mb-1 font-medium">
            Insérer une image dans le texte :
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageInline}
            className="text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* VIDÉO */}
        <input
          type="text"
          placeholder="URL de la vidéo (optionnel)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* ERREUR */}
        {error && <p className="text-red-500">{error}</p>}

        {/* BOUTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? "Publication…" : "Publier"}
        </button>
      </form>
    </div>
  );
}
