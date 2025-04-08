import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const telephone = formData.get("telephone");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("profilePicture");

    // Valider les champs obligatoires
    if (!firstName || !lastName || !telephone || !email || !password) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Hachage du mot de passe (exemple avec bcrypt)
    const hashedPassword = await hash(password, 10);

    // Gérer la photo de profil (file) si besoin
    // Par exemple, uploader vers un service externe ou la stocker localement.

    // Créer l'utilisateur dans la base
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.toString(),
        lastName: lastName.toString(),
        telephone: telephone.toString(),
        email: email.toString(),
        password: hashedPassword,
        // profilePicture: si vous gérez l'upload
      },
    });

    return NextResponse.json({ message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (err) {
    console.error("Erreur API /signup :", err);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
