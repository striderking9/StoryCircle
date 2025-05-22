// src/app/profile/page.tsx
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/authOptions"; // Assurez-vous que le chemin est correct

const prisma = new PrismaClient();

export default async function ProfilePage() {
  // Récupère la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // Redirige vers la page de connexion si aucun utilisateur n'est connecté
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600 dark:text-gray-300">
          Vous devez être connecté pour accéder à votre profil.
        </p>
        <div className="flex justify-center">
          <Link href="/signin" className="mt-4 text-blue-500 hover:underline">
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  // Récupère les informations détaillées de l'utilisateur (et ses articles publiés)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, imageUrl: true, createdAt: true },
      },
    },
  });

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600 dark:text-gray-300">
          Utilisateur non trouvé.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      {/* En-tête du profil */}
      <section className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Avatar" className="object-cover w-full h-full"/>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              Pas d'image
            </div>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">
          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Utilisateur"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        <Link
          href="/profile/edit"
          className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Modifier le profil
        </Link>
      </section>

      {/* Statistiques ou résumé */}
      <section className="mb-10 text-center">
        <div className="flex justify-center gap-8">
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {user.posts.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Articles publiés</p>
          </div>
          {/* D'autres statistiques peuvent être ajoutées ici */}
        </div>
      </section>

      {/* Liste des articles publiés */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Mes articles
        </h2>
        {user.posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            Vous n'avez pas encore publié d'article.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                    Pas d'image
                  </div>
                )}
                <div className="p-4">
                  <Link href={`/posts/${post.id}`} className="hover:text-blue-500 transition-colors">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Publié le {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
