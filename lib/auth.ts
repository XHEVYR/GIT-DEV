import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET, 
  // TAMBAHAN PENTING UNTUK VERCEL:
  trustHost: true, 
  
  // Aktifkan debug hanya jika development, atau nyalakan true sementara untuk cek logs di Vercel
  debug: process.env.NODE_ENV === "development", 

  pages: {
    signIn: "/auth/login",
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

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          // Debugging log (akan muncul di Vercel Logs)
          if (!user) {
            console.log("User tidak ditemukan:", credentials.username);
            return null;
          }

          // PERINGATAN: Password plain text (Sangat tidak disarankan untuk production, tapi kita ikuti kode mu dulu)
          if (user.password === credentials.password) {
            return {
              id: user.id.toString(),
              name: user.name,
              username: user.username,
            };
          } else {
             console.log("Password salah untuk user:", credentials.username);
          }
          
          return null;
        } catch (error) {
          console.error("Error Database saat Login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
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