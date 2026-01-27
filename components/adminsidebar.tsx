'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Plus, Map, Moon, Sun } from 'lucide-react';

export default function AdminSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('sidebar-theme');
    return savedTheme === 'dark';
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('sidebar-theme', newDarkMode ? 'dark' : 'light');
  };

  // Helper untuk class warna agar kode tidak terlalu panjang di dalam JSX
  const themeClasses = isDark 
    ? 'bg-slate-950 border-slate-800 text-slate-300' 
    : 'bg-white border-slate-200 text-slate-600';

  return (
    <aside
      className={`${isMinimized ? 'w-20' : 'w-64'} ${themeClasses} h-screen fixed left-0 top-0 border-r transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} p-6 mb-2`}>
        {!isMinimized && (
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Ne<span className={isDark ? 'text-slate-100' : 'text-slate-900'}>Lar</span>
          </h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          {isMinimized ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        <NavItem 
          href="/admin" 
          icon={<MapPin size={20} />} 
          label="Data Lokasi" 
          isMinimized={isMinimized} 
          isDark={isDark} 
        />
        <NavItem 
          href="/admin/input" 
          icon={<Plus size={20} />} 
          label="Tambah Baru" 
          isMinimized={isMinimized} 
          isDark={isDark} 
        />
        
        <div className={`my-4 mx-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
        
        <NavItem 
          href="/peta" 
          icon={<Map size={20} />} 
          label="Lihat Peta" 
          isMinimized={isMinimized} 
          isDark={isDark} 
        />
      </nav>

      {/* Bottom Actions (Dark Mode Toggle) */}
      <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <button
          onClick={toggleDarkMode}
          className={`flex items-center w-full gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'hover:bg-slate-800 text-yellow-400' 
              : 'hover:bg-slate-100 text-indigo-600'
          } ${isMinimized ? 'justify-center' : ''}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {!isMinimized && <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  );
}

// Komponen Kecil untuk Navigasi agar kode utama lebih bersih
function NavItem({ href, icon, label, isMinimized, isDark }: any) {
  const activeStyles = isDark 
    ? 'hover:bg-indigo-500/10 hover:text-indigo-400' 
    : 'hover:bg-indigo-50 hover:text-indigo-600';

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${activeStyles} ${
        isMinimized ? 'justify-center' : ''
      }`}
      title={isMinimized ? label : ''}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isMinimized && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}