"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void; // Fungsi yang akan dipanggil saat mengetik
  placeholder?: string; // Teks placeholder opsional
}

export default function SearchBar({ onSearch, placeholder = "Cari data..." }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      {/* Ikon Kaca Pembesar */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)} // Kirim text ke parent setiap mengetik
      />
    </div>
  );
}