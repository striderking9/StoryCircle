// src/app/posts/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

interface PageProps {
  params: { id: string };
}

export default async function PostDetailPage({ params: { id } }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { email: true } } },
  });

  if (!post) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600 dark:text-gray-300">
          Article non trouvé
        </p>
        <div className="flex justify-center">
          <Link href="/" className="mt-4 text-blue-500 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          {post.title}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {post.content}
        </p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Image de l'article"
            className="w-full max-h-96 object-cover mb-6 rounded-lg shadow-lg"
          />
        )}
        {post.videoUrl && (
          <video
            controls
            src={post.videoUrl}
            className="w-full mb-6 rounded-lg shadow-lg"
          ></video>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Publié par {post.author.email} le{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <Link href="/" className="mt-4 sm:mt-0 text-blue-500 hover:underline text-sm">
            Retour à l'accueil
          </Link>
        </div>
      </article>
    </main>
  );
}
