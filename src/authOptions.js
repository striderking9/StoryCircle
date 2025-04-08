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
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Vérification de base
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez renseigner l'email et le mot de passe.");
        }

        // Recherche de l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim() },
        });
        if (!user) {
          throw new Error("Utilisateur non trouvé.");
        }

        // Comparaison du mot de passe (bcryptjs)
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe invalide.");
        }

        // Retourne l'utilisateur (inclut firstName, lastName, etc.)
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName; // Assurez-vous que user.firstName est bien défini
        token.lastName = user.lastName;
        token.image = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstName = token.firstName; // On récupère firstName ici
      session.user.lastName = token.lastName;
      session.user.image = token.image;
      return session;
    },
  },
  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
