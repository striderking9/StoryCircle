import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session côté serveur =", session); // Pour vérifier la session

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // On attend un JSON contenant title, content, imageUrl, videoUrl
    const { title, content, imageUrl, videoUrl } = await request.json();

    // Créer l'article en base avec le contenu (qui peut être du HTML)
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        author: { connect: { email: session.user.email } },
      },
    });

    return new Response(JSON.stringify(post), { status: 201 });
  } catch (error) {
    console.error("Erreur /api/posts :", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
