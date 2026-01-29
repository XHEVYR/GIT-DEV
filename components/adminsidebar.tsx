'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin, Plus, Map, HomeIcon, DoorOpenIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

  interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMinimized: boolean;
  active: boolean;
}

export default function AdminSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();



  // Helper untuk menentukan apakah link sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`${
        isMinimized ? 'w-20' : 'w-64'
      } bg-white h-screen fixed left-0 top-0 border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm z-50`}
    >
      {/* Header */}
      <div className={`flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} p-6 mb-2`}>
        {!isMinimized && (
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">
            GIS<span className="text-slate-900">App</span>
          </h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 rounded-xl transition-colors hover:bg-slate-100 text-slate-500"
          title={isMinimized ? "Buka Menu" : "Tutup Menu"}
        >
          {isMinimized ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        <NavItem 
          href="/admin" 
          icon={<HomeIcon size={20} />}
          label="Dashboard"
          isMinimized={isMinimized}
          active={isActive('/admin')}
        />
        <NavItem 
          href="/admin/data" 
          icon={<MapPin size={20} />} 
          label="Data Lokasi" 
          isMinimized={isMinimized} 
          active={isActive('/admin/data')}
        />
        <NavItem 
          href="/admin/input" 
          icon={<Plus size={20} />} 
          label="Tambah Baru" 
          isMinimized={isMinimized} 
          active={isActive('/admin/input')}
        />        
        <NavItem 
          href="/" 
          icon={<Map size={20} />} 
          label="Lihat Peta" 
          isMinimized={isMinimized} 
          active={isActive('/')}
        />

                
        <div className="my-7 mx-3 h-px bg-slate-100" />

        <NavItem 
          href="/" 
          icon={<DoorOpenIcon size={20} />}
          label="Logout"
          isMinimized={isMinimized}
          active={false}
        />
      </nav>

      {/* Footer (Opsional) */}
      {!isMinimized && (
        <div className="p-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Admin Dashboard v1.0
          </p>
        </div>
      )}
    </aside>
  );
}

// Komponen Kecil NavItem
function NavItem({ href, icon, label, isMinimized, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
          : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
      } ${isMinimized ? 'justify-center' : ''}`}
      title={isMinimized ? label : ''}
    >
      <div className={`shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      {!isMinimized && <span className="text-sm font-semibold">{label}</span>}
    </Link>
  );
}