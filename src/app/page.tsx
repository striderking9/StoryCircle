// src/app/page.tsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

// Petite utilitaire pour tronquer et nettoyer un HTML en texte pur
function excerptFromHtml(html: string, maxLength = 120) {
  // On retire toutes les balises HTML (img, figure, etc.)
  const text = html.replace(/<[^>]+>/g, "");
  // On tronque proprement
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export default async function HomePage() {
  const allPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,  // votre seule "photo de couverture"
      content: true,   // pour l’extrait texte
      createdAt: true,
    },
  });

  const bigArticle   = allPosts[0];
  const sideArticles = allPosts.slice(1, 5);
  const lastActus    = allPosts.slice(5, 10);

  return (
    <main className="
      max-w-[1400px] mx-auto px-4 py-8
      bg-white text-gray-900 dark:bg-gray-900 dark:text-white
      transition-colors
    ">
      {/* Sélection de la rédaction */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Sélection de la rédaction</h2>
        {(!bigArticle && sideArticles.length === 0) ? (
          <p className="text-gray-500 dark:text-gray-400">Aucun article à afficher.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gros article à gauche */}
            {bigArticle && (
              <div className="
                md:col-span-2
                bg-white text-gray-900 dark:bg-gray-800 dark:text-white
                rounded-lg overflow-hidden
              ">
                {bigArticle.imageUrl ? (
                  <img
                    src={bigArticle.imageUrl}
                    alt={bigArticle.title}
                    className="w-full h-60 sm:h-72 md:h-80 lg:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="p-4">
                  <Link href={`/posts/${bigArticle.id}`}>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-blue-500">
                      {bigArticle.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {excerptFromHtml(bigArticle.content)}
                  </p>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Publié le {new Date(bigArticle.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Articles empilés à droite */}
            <div className="flex flex-col gap-4">
              {sideArticles.map((post) => (
                <div
                  key={post.id}
                  className="
                    flex bg-white text-gray-900 dark:bg-gray-800 dark:text-white
                    rounded-lg overflow-hidden hover:shadow-md transition-shadow
                  "
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-1/3 h-24 object-cover"
                    />
                  ) : (
                    <div className="w-1/3 h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                      Pas d'image
                    </div>
                  )}
                  <div className="p-3 w-2/3 flex flex-col justify-center">
                    <Link href={`/posts/${post.id}`}>
                      <h4 className="text-sm font-semibold line-clamp-2 hover:text-blue-500">
                        {post.title}
                      </h4>
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Publié le {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Les dernières actus */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Les dernières actus</h2>
        {lastActus.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Pas d'actus récentes.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lastActus.map((post) => (
              <div
                key={post.id}
                className="
                  min-w-[160px] bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  rounded-lg overflow-hidden hover:shadow-md transition-shadow flex-shrink-0
                "
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="p-2">
                  <Link href={`/posts/${post.id}`}>
                    <h5 className="text-sm font-semibold line-clamp-2 hover:text-blue-500">
                      {post.title}
                    </h5>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
