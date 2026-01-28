'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';  
import { MapPin, Image as ImageIcon, Save, XCircle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

// Import Map secara dinamis
const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-100 flex items-center justify-center rounded-2xl animate-pulse">
      <span className="text-slate-400 font-medium">Memuat Peta...</span>
    </div>
  )
});

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "", lat: "", lon: "", category: "", description: "", address: "", image: ""
  });

  const handleMapClick = (lat: number, lon: number) => {
    setError(null);
    setForm(prev => ({...prev, lat: lat.toString(), lon: lon.toString()}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.lat || !form.lon) {
      setError("Koordinat belum dipilih! Silakan klik titik pada peta.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/admin'), 1500);
      } else {
        throw new Error("Gagal menyimpan data ke server.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  // Style Class Variables (Clean Light Mode)
  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-800 transition-all outline-none text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Tambah <span className="text-indigo-600">Lokasi</span>
          </h1>
          <p className="mt-2 text-slate-500">
            Lengkapi detail koordinat dan informasi tempat untuk sistem GIS.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAP SECTION (Kiri) */}
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="rounded-3xl shadow-sm border border-white bg-white p-2 overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-3 bg-indigo-600 rounded-t-2xl text-white">
                <MapPin size={20} />
                <h2 className="font-bold tracking-wide">Plotting Peta</h2>
              </div>
              <div className="h-[450px] w-full relative rounded-b-2xl overflow-hidden border-x border-b border-slate-50">
                <MapInput onLocationSelect={handleMapClick} />
              </div>
              <div className="p-4 flex gap-2 items-start bg-indigo-50/50">
                <Info size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-indigo-800 font-semibold leading-relaxed">
                  Klik peta untuk mengisi Latitude & Longitude otomatis.
                </p>
              </div>
            </div>
          </section>

          {/* FORM SECTION (Kanan) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 size={20} /> <span className="text-sm font-semibold">Data berhasil disimpan!</span>
              </div>
            )}

            <div className="rounded-3xl p-8 shadow-sm border border-white bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className={labelClass}>Nama Tempat</label>
                  <input className={inputClass} placeholder="Contoh: Café Senja" onChange={e => setForm({...form, name: e.target.value})} required />
                </div>

                <div>
                  <label className={labelClass}>Latitude</label>
                  <input className={`${inputClass} font-mono bg-slate-50 cursor-not-allowed`} value={form.lat} readOnly placeholder="0.0000" />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input className={`${inputClass} font-mono bg-slate-50 cursor-not-allowed`} value={form.lon} readOnly placeholder="0.0000" />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Kategori Lokasi</label>
                  <select className={inputClass} onChange={e => setForm({...form, category: e.target.value})} required>
                    <option value="">Pilih Kategori...</option>
                    <option value="hotel">🏨 Hotel & Penginapan</option>
                    <option value="cafe">☕ Cafe & Resto</option>
                    <option value="wisata">✈️ Destinasi Wisata</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>URL Gambar</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                    <input className={`${inputClass} pl-12`} placeholder="https://..." onChange={e => setForm({...form, image: e.target.value})} />
                  </div>
                </div>

                {form.image && (
                  <div className="md:col-span-2 border-2 border-slate-50 rounded-2xl overflow-hidden">
                    <img src={form.image} 
                    alt="Preview" 
                    className="w-full h-44 object-cover" 
                    onError={(e) => e.currentTarget.src = "https://via.placeholder.com/600x300?text=Error"} />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className={labelClass}>Alamat Lengkap</label>
                  <textarea className={`${inputClass} min-h-[80px]`} placeholder="Jl. Raya..." onChange={e => setForm({...form, address: e.target.value})} required />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi</label>
                  <textarea className={`${inputClass} min-h-[100px]`} placeholder="Deskripsi singkat..." onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => router.back()} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                  <XCircle size={20} /> Batal
                </button>
                <button disabled={loading || success} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50">
                  {loading ? "Menyimpan..." : success ? "Tersimpan!" : <><Save size={20} /> Simpan Lokasi</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}