import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 Menit (Sesi akan mati sendiri kalau didiamkan)
  },
  secret: process.env.NEXTAUTH_SECRET, // Mengambil dari .env tadi
  pages: {
    signIn: "/auth/login", // Halaman login kita
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        // Cek password (Sederhana)
        if (user && user.password === credentials.password) {
          return {
            id: user.id.toString(),
            name: user.name,
            username: user.username,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Agar data user ikut tersimpan di sesi browser
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
  }
};