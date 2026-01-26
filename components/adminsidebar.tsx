import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0">
      <div className="p-8">
        <h2 className="text-3xl font-black mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          GIS
        </h2>
        
        <nav className="space-y-3">
          <Link href="/admin" className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition">
            → Data Lokasi
          </Link>
          <Link href="/admin/input" className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition">
            → Tambah Baru
          </Link>
          <div className="my-6 h-px bg-slate-800"></div>
          <Link href="/peta" className="block px-4 py-3 text-green-500 hover:text-green-400 hover:bg-slate-900 rounded-lg transition font-semibold">
            → Lihat Peta
          </Link>
        </nav>
      </div>
    </aside>
  );
}