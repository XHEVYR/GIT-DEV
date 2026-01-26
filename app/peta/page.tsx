"use client";
import dynamic from 'next/dynamic';

// Wajib pakai dynamic import biar tidak error SSR
const Map = dynamic(() => import('@/components/map'), { ssr: false });

export default function PetaPage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <nav className="bg-blue-600 p-4 text-white font-bold">GIS KOTA BLITAR</nav>
      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}