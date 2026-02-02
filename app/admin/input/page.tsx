'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Image as ImageIcon, 
  Save, 
  XCircle, 
  Info, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

// Import Map secara dinamis
const MapInput = dynamic(() => import("@/components/maps/mapinput"), {
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

  // State menggunakan String untuk Lat/Lon agar input manual lancar
  const [form, setForm] = useState({
    name: "", 
    lat: "", 
    lon: "", 
    category: "", 
    description: "", 
    address: "", 
    image: ""
  });

  // Handler saat Peta diklik (Menerima number -> ubah ke string)
  const handleMapClick = (lat: number, lon: number) => {
    setError(null);
    setForm(prev => ({ 
      ...prev, 
      lat: lat.toString(), 
      lon: lon.toString() 
    }));
  };

  // Handler saat Input Lat/Lon diketik manual
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'lat' | 'lon') => {
    const value = e.target.value;
    // Validasi regex: hanya angka, minus, dan titik
    if (/^-?[\d.]*$/.test(value)) {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi Form
    if (!form.lat || !form.lon) {
      setError("Koordinat belum diisi! Silakan klik peta atau ketik manual.");
      return;
    }

    setLoading(true);

    // Konversi Lat/Lon kembali ke Float sebelum dikirim ke API
    const payload = {
      ...form,
      lat: parseFloat(form.lat),
      lon: parseFloat(form.lon)
    };

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  // Style Class Variables (Sama persis dengan halaman Edit)
  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-800 transition-all outline-none text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <header className="border-b border-slate-200 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Tambah <span className="text-indigo-600">Lokasi</span>
            </h1>
            <p className="mt-2 text-slate-500">
              Lengkapi detail koordinat dan informasi tempat baru.
            </p>
          </div>
          <button onClick={() => router.back()} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition text-slate-600">
             <XCircle size={24} />
          </button>
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
                {/* Kirim Lat/Lon yang sudah di-parse ke Float ke Map 
                  agar marker bergerak saat diketik manual
                */}
                <MapInput 
                  onLocationSelect={handleMapClick} 
                  inputLat={form.lat ? parseFloat(form.lat) : undefined}
                  inputLon={form.lon ? parseFloat(form.lon) : undefined}
                />
              </div>
              <div className="p-4 flex gap-2 items-start bg-indigo-50/50">
                <Info size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-indigo-800 font-semibold leading-relaxed">
                  Klik peta atau ketik koordinat di form kanan untuk menentukan lokasi.
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
                <CheckCircle2 size={20} /> <span className="text-sm font-semibold">Data berhasil disimpan! Mengalihkan...</span>
              </div>
            )}

            <div className="rounded-3xl p-8 shadow-sm border border-white bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="md:col-span-2">
                  <label className={labelClass}>Nama Tempat</label>
                  <input 
                    className={inputClass} 
                    placeholder="Masukkan nama tempat" 
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>

                {/* LATITUDE (Bisa Ketik Manual) */}
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    className={`${inputClass} font-mono`} 
                    value={form.lat} 
                    onChange={(e) => handleCoordinateChange(e, 'lat')}
                    placeholder="-8.1234" 
                  />
                </div>

                {/* LONGITUDE (Bisa Ketik Manual) */}
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    className={`${inputClass} font-mono`} 
                    value={form.lon} 
                    onChange={(e) => handleCoordinateChange(e, 'lon')}
                    placeholder="110.1234" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Kategori Lokasi</label>
                  <select 
                    className={inputClass} 
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })} 
                    required
                  >
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
                    <input 
                      className={`${inputClass} pl-12`} 
                      placeholder="https://..." 
                      value={form.image}
                      onChange={e => setForm({ ...form, image: e.target.value })} 
                    />
                  </div>
                </div>

                {form.image && (
  <div className="md:col-span-2 border-2 border-slate-50 rounded-2xl overflow-hidden bg-slate-100 relative w-full h-44">
    <img
      src={form.image}
      alt="Preview"
      referrerPolicy="no-referrer"
      className="object-cover w-full h-full"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        img.src = "https://via.placeholder.com/600x300?text=Error";
        img.classList.add("opacity-50");
      }}
    />
  </div>
)}

                <div className="md:col-span-2">
                  <label className={labelClass}>Alamat Lengkap</label>
                  <textarea 
                    className={`${inputClass} min-h-[80px]`} 
                    placeholder="Jl. Raya..." 
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })} 
                    required 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi</label>
                  <textarea 
                    className={`${inputClass} min-h-[100px]`} 
                    placeholder="Deskripsi singkat" 
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                  />
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