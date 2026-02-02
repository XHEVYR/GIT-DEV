import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Import Komponen Wajib untuk Login & Keamanan
import Providers from "@/components/auth/providers";
import AutoLogout from "@/components/auth/autoLogout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ubah Metadata sesuai Project PKL
export const metadata: Metadata = {
  title: "GIS Kota Blitar",
  description: "Aplikasi WebGIS Data Lokasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. BUNGKUS DENGAN PROVIDERS 
          Tanpa ini, error "useSession must be wrapped" akan muncul 
        */}
        <Providers>
          
          {/* 3. PASANG CCTV AUTO LOGOUT DI SINI */}
          <AutoLogout />
          
          {/* Render Halaman Website */}
          {children}
          
        </Providers>
      </body>
    </html>
  );
}