'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Image as ImageIcon, Info, Save, XCircle } from 'lucide-react';

const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl animate-pulse">
      <span className="text-slate-400">Memuat Peta...</span>
    </div>
  )
});

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-theme') === 'dark';
    }
    return false;
  });
  const [form, setForm] = useState({
    name: "", lat: "", lon: "", category: "", description: "", address: "", image: ""
  });

  const handleMapClick = (lat: number, lon: number) => {
    setForm({...form, lat: lat.toString(), lon: lon.toString()});
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false);
    router.push('/admin'); 
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 transition-all outline-none text-sm ${
    isDark 
    ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500' 
    : 'bg-white border-slate-100 text-slate-800 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50'
  }`;

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${
    isDark ? 'text-slate-400' : 'text-slate-500'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <header>
          <h1 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Tambah <span className="text-indigo-500">Lokasi</span>
          </h1>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Lengkapi detail koordinat dan informasi tempat untuk sistem GIS.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAP SECTION - Left Side */}
          <section className="lg:col-span-5 sticky top-8">
            <div className={`rounded-3xl shadow-xl overflow-hidden border ${isDark ? 'border-slate-800' : 'border-white'} transition-all`}>
              <div className={`px-6 py-4 flex items-center gap-3 ${isDark ? 'bg-slate-800' : 'bg-indigo-600'}`}>
                <MapPin className="text-white" size={20} />
                <h2 className="text-white font-bold tracking-wide">Plotting Peta</h2>
              </div>
              <div className="h-[450px] w-full relative">
                <MapInput onLocationSelect={handleMapClick} />
              </div>
              <div className={`p-4 text-xs italic ${isDark ? 'bg-slate-800/50 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                * Ketuk pada peta untuk mendapatkan nilai Latitude & Longitude otomatis.
              </div>
            </div>
          </section>

          {/* FORM SECTION - Right Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            <div className={`rounded-3xl p-8 shadow-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-white'}`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Tempat */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Nama Tempat</label>
                  <input 
                    className={inputClass}
                    placeholder="Masukkan nama lokasi..."
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>

                {/* Koordinat */}
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input type="number" step="any" className={`${inputClass} font-mono opacity-80`} value={form.lat} readOnly placeholder="0.0000" />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input type="number" step="any" className={`${inputClass} font-mono opacity-80`} value={form.lon} readOnly placeholder="0.0000" />
                </div>

                {/* Kategori */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Kategori Lokasi</label>
                  <select 
                    className={inputClass}
                    onChange={e => setForm({...form, category: e.target.value})}
                    required
                  >
                    <option value="">Pilih Kategori...</option>
                    <option value="hotel">🏨 Hotel & Penginapan</option>
                    <option value="cafe">☕ Cafe & Resto</option>
                    <option value="wisata">✈️ Destinasi Wisata</option>
                  </select>
                </div>

                {/* Image Link */}
                <div className="md:col-span-2">
                  <label className={labelClass}>URL Gambar</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      className={`${inputClass} pl-12`}
                      placeholder="https://images.unsplash.com/..."
                      onChange={e => setForm({...form, image: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Preview Image */}
                {form.image && (
                  <div className="md:col-span-2 animate-in fade-in zoom-in duration-300">
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-2xl border-4 border-slate-100 dark:border-slate-800 shadow-inner" 
                      onError={(e) => e.currentTarget.src = "https://via.placeholder.com/600x300?text=Format+Gambar+Salah"} 
                    />
                  </div>
                )}

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Alamat Lengkap</label>
                  <textarea 
                    className={`${inputClass} min-h-[80px]`}
                    placeholder="Jl. Nama Jalan No. XX..."
                    onChange={e => setForm({...form, address: e.target.value})}
                    required 
                  />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi Singkat</label>
                  <textarea 
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Ceritakan tentang tempat ini..."
                    onChange={e => setForm({...form, description: e.target.value})} 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <XCircle size={20} /> Batal
                </button>
                <button 
                  disabled={loading} 
                  className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : <><Save size={20} /> Simpan Lokasi</>}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}