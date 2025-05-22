// src/app/posts/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import parse from "html-react-parser";

const prisma = new PrismaClient();

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage(props: PageProps) {
  // 1) On récupère d’abord props, puis on extrait params.id
  const {
    params: { id },
  } = props;

  // 2) On interroge la base
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { firstName: true, email: true } },
    },
  });

  if (!post) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600 dark:text-gray-300">
          Article non trouvé
        </p>
        <div className="flex justify-center mt-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  // 3) Affichage
  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          {post.title}
        </h1>

        <div
  className={`
    prose prose-lg dark:prose-invert
    text-gray-700 dark:text-gray-300
    overflow-visible
    [&_img]:max-h-[400px]
    [&_img]:w-auto [&_img]:max-w-full
    [&_img]:object-contain [&_img]:rounded-lg
  `}
>
  {parse(post.content)}
</div>



        {post.imageUrl && (
          <div className="mx-auto overflow-hidden rounded-lg shadow-lg
                max-w-full sm:max-w-2xl lg:max-w-3xl">
  <img
    src={post.imageUrl}
    alt={`Couverture - ${post.title}`}
    className="w-full h-auto max-h-[60vh] object-cover"
  />
</div>

)}


        {post.videoUrl && (
          <div className="overflow-hidden rounded-lg shadow-lg">
            <video
              controls
              src={post.videoUrl}
              className="w-full max-h-[200px] object-contain"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            Publié par{" "}
            <strong className="text-gray-800 dark:text-gray-200">
              {post.author.firstName || post.author.email}
            </strong>{" "}
            le {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <Link href="/" className="mt-2 sm:mt-0 text-blue-500 hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </article>
    </main>
  );
}
