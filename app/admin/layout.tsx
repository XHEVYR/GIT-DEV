"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/adminsidebar"; // Sesuaikan huruf besar/kecil nama file Anda
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. SECURITY CHECK: Jika belum login, tendang ke halaman login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // 2. LOADING STATE: Tampilkan layar loading saat NextAuth sedang "berpikir"
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          {/* Spinner Sederhana */}
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-500 font-medium text-sm">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  // 3. JIKA SUDAH LOGIN: Tampilkan Layout Admin Lengkap
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar Statis */}
      <AdminSidebar />
      
      {/* Area Konten Utama */}
      {/* ml-64 memberi jarak agar konten tidak tertutup sidebar */}
      <main className="flex-1 ml-64 flex flex-col transition-all duration-300">
        
        {/* HEADER BARU: Menampilkan Siapa yang Login */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
              Control Panel
            </h2>
            
            {/* Info User di Pojok Kanan */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Logged In
                </p>
              </div>
              {/* Avatar Inisial Nama */}
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
            </div>
        </header>

        {/* KONTEN HALAMAN (Input/Data/Dashboard) */}
        {/* Padding ditaruh disini agar Header tetap full-width */}
        <div className="p-8">
           {children}
        </div>

      </main>
    </div>
  );
}