import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Vérifier que les informations sont fournies
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez renseigner l'email et le mot de passe.");
        }
        // Recherche de l'utilisateur par email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Utilisateur non trouvé.");
        }
        // Comparer le mot de passe fourni avec le hash stocké
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe invalide.");
        }
        // Si tout est ok, retourner l'utilisateur
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Vous pouvez ajouter ici des propriétés à la session si besoin
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
