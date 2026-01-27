'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin, Plus, Map } from 'lucide-react';

export default function AdminSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside
      className={`${
        isMinimized ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-slate-900 to-slate-950 text-white h-screen fixed left-0 top-0 border-r border-slate-800 transition-all duration-300 ease-in-out`}
    >
      {/* Header Toggle */}
      <div className="flex items-center justify-center p-6 border-b border-slate-800 relative">
        {!isMinimized && (
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            GIS Map
          </h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 hover:bg-slate-800 rounded-lg transition duration-200 text-slate-400 hover:text-white absolute right-2"
        >
          {isMinimized ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`${isMinimized ? 'p-3' : 'p-6'} space-y-3 flex-1`}>
        {/* Data Lokasi */}
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isMinimized
              ? 'justify-center hover:bg-slate-800'
              : 'hover:bg-slate-800'
          } text-slate-300 hover:text-white group`}
          title={isMinimized ? 'Data Lokasi' : ''}
        >
          <MapPin size={20} className="flex-shrink-0" />
          {!isMinimized && <span>Data Lokasi</span>}
        </Link>

        {/* Tambah Baru */}
        <Link
          href="/admin/input"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isMinimized
              ? 'justify-center hover:bg-slate-800'
              : 'hover:bg-slate-800'
          } text-slate-300 hover:text-white group`}
          title={isMinimized ? 'Tambah Baru' : ''}
        >
          <Plus size={20} className="flex-shrink-0" />
          {!isMinimized && <span>Tambah Baru</span>}
        </Link>

        {/* Divider */}
        {!isMinimized && <div className="my-6 h-px bg-slate-800"></div>}

        {/* Lihat Peta */}
        <Link
          href="/peta"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
            isMinimized
              ? 'justify-center hover:bg-slate-800'
              : 'hover:bg-slate-800'
          } text-cyan-400 hover:text-cyan-300 font-semibold group`}
          title={isMinimized ? 'Lihat Peta' : ''}
        >
          <Map size={20} className="flex-shrink-0" />
          {!isMinimized && <span>Lihat Peta</span>}
        </Link>
      </nav>
    </aside>
  );
}