// src/app/page.tsx
import { PrismaClient, Post } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function HomePage() {
  const posts: (Post & { author: { email: string } })[] = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { email: true } } },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Section Hero */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-800 dark:text-white">
          Bienvenue sur Mon Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Découvrez les derniers articles, partagez vos idées et inspirez-vous avec des contenus de qualité.
        </p>
      </section>

      {/* Grille des posts : 1 colonne par défaut, 4 colonnes à partir de 780px */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Aucun article n'a encore été publié.
        </p>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Image de l'article"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-1">
                  {post.content}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Publié par {post.author.email} le {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/posts/${post.id}`}
                  className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Lire la suite
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
