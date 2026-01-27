"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 1. IMPORT DYNAMIC MAP (Sama seperti halaman Add)
const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => <div className="h-full bg-gray-200 flex items-center justify-center rounded-lg text-gray-600">Memuat Peta...</div>
});

interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  image?: string;
  description?: string;
}

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  // --- HANDLERS ---

  const handleEditClick = (place: Place) => {
    setEditId(place.id);
    setEditForm({ ...place });
    // Scroll ke atas saat edit dimulai
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMapSelect = (lat: number, lon: number) => {
    if (editForm) {
      setEditForm({ ...editForm, lat, lon });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/places/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        // Update data di tabel lokal tanpa fetch ulang (biar cepat)
        setPlaces(places.map(p => p.id === editForm.id ? editForm : p));
        setEditId(null);
        setEditForm(null);
      }
    } catch (err) {
      console.error('Error:', err);
      alert("Gagal menyimpan perubahan");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus "${name}"?`)) {
      try {
        await fetch(`/api/places/${id}`, { method: 'DELETE' });
        setPlaces(places.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm(null);
  };

  // --- RENDER MODE EDIT (TAMPILAN SAMA DENGAN ADD PAGE) ---
  if (editId && editForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Lokasi</h1>
              <p className="text-gray-600">Perbarui data lokasi dan pin point di peta</p>
            </div>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAP SECTION */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-[500px] lg:h-auto">
              <div className="bg-gradient-to-r from-blue-400 to-purple-800 px-6 py-4 flex-shrink-0">
                <h2 className="text-white font-bold text-lg">📍 Ubah Posisi</h2>
                <p className="text-white text-opacity-90 text-sm mt-1">Geser marker untuk update koordinat</p>
              </div>
              <div className="flex-1 w-full relative z-0">
                {/* Kita kirim props posisinya agar map tahu lokasi awal */}
                <MapInput 
                  onLocationSelect={handleMapSelect} 
                  // Tips: Tambahkan prop ini di component MapInput Anda jika ingin marker muncul di lokasi lama
                  // initialLat={editForm.lat} 
                  // initialLon={editForm.lon}
                />
                {/* Overlay teks koordinat */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-2 rounded text-xs font-mono text-center shadow z-[400]">
                  {editForm.lat.toFixed(6)}, {editForm.lon.toFixed(6)}
                </div>
              </div>
            </div>

            {/* FORM SECTION */}
            <form onSubmit={handleSaveEdit} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col">
              <div className="space-y-6">
                {/* NAMA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Tempat *</label>
                  <input 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none text-gray-800 transition" 
                    required 
                  />
                </div>

                {/* KOORDINAT (READ ONLY) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Koordinat (Edit lewat Map)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Latitude</label>
                      <input 
                        type="number" step="any" readOnly
                        value={editForm.lat}
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Longitude</label>
                      <input 
                        type="number" step="any" readOnly
                        value={editForm.lon}
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* KATEGORI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Kategori *</label>
                  <select 
                    value={editForm.category}
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:border-yellow-500 outline-none transition" 
                    required
                  >
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
                    value={editForm.image || ""}
                    onChange={e => setEditForm({...editForm, image: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 outline-none text-gray-800 transition" 
                  />
                  {/* PREVIEW IMAGE */}
                  {editForm.image && (
                    <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                       <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/400x300?text=Error"} />
                    </div>
                  )}
                </div>

                {/* ALAMAT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Alamat Lengkap *</label>
                  <textarea 
                    value={editForm.address || ""}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 outline-none text-gray-800 transition resize-none" 
                    rows={3} required 
                  />
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Deskripsi</label>
                  <textarea 
                    value={editForm.description || ""}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 outline-none text-gray-800 transition resize-none" 
                    rows={4}
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
                  <button type="button" onClick={handleCancel} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                    Batal
                  </button>
                  <button disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-800 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-900 transition disabled:opacity-50">
                    {loading ? "⏳ Menyimpan..." : "✓ Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MODE TABEL (DEFAULT) ---
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Lokasi</h1>
        <Link href="/admin/input" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow transition">
          + Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama Tempat</th>
              <th className="p-4 font-semibold text-gray-600">Kategori</th>
              <th className="p-4 font-semibold text-gray-600">Koordinat</th>
              <th className="p-4 font-semibold text-gray-600">Alamat</th>
              <th className="p-4 font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {places.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">
                  {place.name}
                  {place.image && <span className="ml-2 text-xs text-green-600 font-bold" title="Ada gambar">📷</span>}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    place.category === 'wisata' ? 'bg-purple-100 text-purple-800' :
                    place.category === 'hotel' ? 'bg-blue-100 text-blue-800' :
                    place.category === 'cafe' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {place.category}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm font-mono">
                  {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
                </td>
                <td className="p-4 text-gray-500 text-sm truncate max-w-xs">
                  {place.address || "-"}
                </td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => handleEditClick(place)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold transition shadow-sm">
                    ✎ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(place.id, place.name)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold transition shadow-sm">
                    🗑 Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {places.length === 0 && <p className="p-8 text-center text-gray-500">Belum ada data lokasi.</p>}
      </div>
    </div>
  );
}