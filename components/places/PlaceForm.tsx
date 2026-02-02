"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, 
  Image as ImageIcon, // <--- Icon Gambar
  Save, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { Place } from '@/types'; // Pastikan path ini sesuai dengan file types kamu

// Import Peta dari folder maps
const MapInput = dynamic(() => import("@/components/maps/mapinput"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-slate-100 flex items-center justify-center animate-pulse">Memuat Peta...</div>
});

interface PlaceFormProps {
  initialData: Place;
  onSave: (data: Place) => Promise<void>;
  onCancel: () => void;
}

export default function PlaceForm({ initialData, onSave, onCancel }: PlaceFormProps) {
  // State form
  const [formData, setFormData] = useState<Place>({
    ...initialData,
    lat: initialData.lat.toString(),
    lon: initialData.lon.toString(),
    // Pastikan field optional memiliki default string kosong agar tidak error "uncontrolled input"
    image: initialData.image || "",
    description: initialData.description || "",
    address: initialData.address || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan");
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-800 outline-none text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <header className="border-b border-slate-200 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Edit <span className="text-indigo-600">Lokasi</span></h1>
          <p className="mt-2 text-slate-500">Perbarui informasi, foto, dan titik koordinat.</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition text-slate-600">
           <XCircle size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: PETA */}
        <section className="lg:col-span-5 lg:sticky lg:top-8">
           <div className="rounded-3xl shadow-sm border border-white bg-white p-2 overflow-hidden">
             <div className="px-5 py-4 flex items-center gap-3 bg-indigo-600 rounded-t-2xl text-white">
               <MapPin size={20} /> <h2 className="font-bold tracking-wide">Posisi</h2>
             </div>
             <div className="h-[450px] w-full relative rounded-b-2xl overflow-hidden">
               <MapInput 
                 onLocationSelect={(lat, lon) => setFormData({...formData, lat, lon})}
                 inputLat={parseFloat(formData.lat.toString())}
                 inputLon={parseFloat(formData.lon.toString())}
               />
             </div>
           </div>
        </section>

        {/* Kolom Kanan: FORM INPUT */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <div className="rounded-3xl p-8 shadow-sm border border-white bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Nama Tempat */}
             <div className="md:col-span-2">
                <label className={labelClass}>Nama Tempat</label>
                <input className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
             </div>
             
             {/* Koordinat */}
             <div>
                <label className={labelClass}>Latitude</label>
                <input type="number" step="any" className={inputClass} value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
             </div>
             <div>
                <label className={labelClass}>Longitude</label>
                <input type="number" step="any" className={inputClass} value={formData.lon} onChange={e => setFormData({...formData, lon: e.target.value})} />
             </div>

             {/* Kategori */}
             <div className="md:col-span-2">
                <label className={labelClass}>Kategori</label>
                <select className={inputClass} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                   <option value="hotel">🏨 Hotel</option>
                   <option value="cafe">☕ Cafe</option>
                   <option value="wisata">✈️ Wisata</option>
                </select>
             </div>

             {/* --- BAGIAN YANG HILANG SUDAH DIKEMBALIKAN DI BAWAH INI --- */}

             {/* 1. Link Gambar */}
             <div className="md:col-span-2">
                <label className={labelClass}>URL Gambar</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                  <input 
                    className={`${inputClass} pl-12`} 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
             </div>

             {/* 2. Preview Gambar (Muncul jika ada link) */}
             {formData.image && (
                <div className="md:col-span-2 border-2 border-slate-50 rounded-2xl overflow-hidden bg-slate-50">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover hover:scale-105 transition duration-500" 
                    onError={(e) => e.currentTarget.src = "https://via.placeholder.com/600x300?text=Gambar+Tidak+Ditemukan"} 
                  />
                </div>
             )}
             
             {/* Alamat */}
             <div className="md:col-span-2">
                <label className={labelClass}>Alamat</label>
                <textarea 
                  className={`${inputClass} min-h-[80px]`} 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  required 
                />
             </div>

             {/* 3. Description / Deskripsi */}
             <div className="md:col-span-2">
                <label className={labelClass}>Deskripsi</label>
                <textarea 
                  className={`${inputClass} min-h-[100px]`} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Ceritakan sedikit tentang tempat ini..."
                />
             </div>

             {/* Tombol Aksi */}
             <div className="md:col-span-2 pt-6 flex gap-4">
                <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition">Batal</button>
                <button disabled={loading} className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                   {loading ? "Menyimpan..." : <><Save size={20} /> Simpan Perubahan</>}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}