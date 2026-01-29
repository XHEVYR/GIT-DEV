"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSession } from "next-auth/react"; // <--- 1. Import useSession

// Import Peta
const Map = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center bg-gray-100 text-gray-500">Memuat Peta...</div>
});

export default function HomePage() {
  const { data: session } = useSession(); // <--- 2. Cek status login

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navbar Atas */}
      <nav className="bg-white p-4 text-indigo-600 font-bold flex justify-between items-center shadow-sm z-10 border-b">
        <div className="flex items-center gap-2">
           <span className="text-xl font-bold tracking-tight text-slate-800">GIS <span className="text-indigo-600">KOTA BLITAR</span></span>
        </div>
        
        {/* LOGIKA TOMBOL PINTAR */}
        {session ? (
          // JIKA SUDAH LOGIN: Tampilkan tombol Dashboard & Nama Admin
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">
                Halo, <span className="font-bold text-indigo-600">{session.user?.name}</span>
             </span>
             <Link href="/admin" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm tracking-wide hover:bg-emerald-700 transition shadow-lg">
                KEMBALI KE DASHBOARD
             </Link>
          </div>
        ) : (
          // JIKA BELUM LOGIN: Tampilkan tombol Login biasa
          <Link href="/auth/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold text-sm tracking-wide hover:bg-indigo-700 transition shadow-lg">
            LOGIN ADMIN
          </Link>
        )}

      </nav>

      {/* Area Peta */}
      <div className="flex-1 relative z-0 bg-slate-100">
        <Map />
      </div>
    </div>
  );
}