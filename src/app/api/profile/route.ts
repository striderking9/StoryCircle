import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/profile?email=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
        telephone: true,
        bio: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/profile:", error);
    return NextResponse.json(
      { error: "Erreur interne lors du chargement du profil." },
      { status: 500 }
    );
  }
}

// PATCH /api/profile
export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { email, firstName, lastName, telephone, bio, profilePicture } = data;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis pour la mise à jour." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        telephone,
        bio,
        profilePicture,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Erreur PATCH /api/profile:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
