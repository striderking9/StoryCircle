import NextAuth from "next-auth";
import { authOptions } from "@/authOptions"; // Utilise l'alias '@/'
  
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
