"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg text-gray-600">Memuat Peta...</div>
});

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", 
    lat: "", 
    lon: "", 
    category: "", 
    description: "",
    address: "",
    image: ""
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tambah Lokasi Baru</h1>
          <p className="text-gray-600">Pilih lokasi di peta dan isi data lengkap tempat Anda</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* MAP SECTION */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="bg-gradient-to-r from-blue-400 to-purple-800 px-6 py-4 flex-shrink-0">
              <h2 className="text-white font-bold text-lg">📍 Pilih Lokasi</h2>
              <p className="text-blue-100 text-sm mt-1">Klik atau geser pin</p>
            </div>
            <div className="flex-1 w-full">
              <MapInput onLocationSelect={handleMapClick} />
            </div>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col overflow-y-auto">
            <div className="space-y-6">
              {/* NAMA */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Tempat *</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-800 transition" 
                  placeholder="Contoh: Café Indah"
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>

              {/* KOORDINAT (READ ONLY) */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Koordinat (Otomatis dari Map)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Latitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm" 
                      placeholder="Dari map"
                      value={form.lat}
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Longitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm" 
                      placeholder="Dari map"
                      value={form.lon}
                      readOnly 
                    />
                  </div>
                </div>
              </div>

              {/* KATEGORI */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Kategori *</label>
                <select 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  onChange={e => setForm({...form, category: e.target.value})}
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  <option value="hotel">🏨 Hotel</option>
                  <option value="cafe">☕ Cafe / Resto</option>
                  <option value="wisata">✈️ Tempat Wisata</option>
                  {/* <option value="kampus">🎓 Kampus / Sekolah</option> */}
                </select>
              </div>

              {/* GAMBAR */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Link Gambar (URL)</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-800 transition" 
                  placeholder="https://example.com/image.jpg"
                  onChange={e => setForm({...form, image: e.target.value})} 
                />
                <p className="text-xs text-gray-500 mt-2">💡 Copy link gambar dari Google Images</p>
              </div>

              {/* PREVIEW IMAGE */}
          {form.image && (
            <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img 
                src={form.image} 
                alt="Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => e.currentTarget.src = "https://via.placeholder.com/400x300?text=URL+Tidak+Valid"} 
              />
            </div>
          )}

              {/* ALAMAT */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Alamat Lengkap *</label>
                <textarea 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-800 transition resize-none" 
                  placeholder="Masukkan alamat lengkap tempat ini"
                  rows={3}
                  onChange={e => setForm({...form, address: e.target.value})}
                  required 
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Deskripsi</label>
                <textarea 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-800 transition resize-none" 
                  placeholder="Deskripsikan tempat ini..."
                  rows={4}
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>

              {/* BUTTON */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button 
                  disabled={loading} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-800 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Menyimpan..." : "✓ Simpan Lokasi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}