"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  MapPin, 
  Image as ImageIcon, 
  Save, 
  XCircle, 
  Info, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';

// 1. IMPORT DYNAMIC MAP
const MapInput = dynamic(() => import("@/components/mapinput"), { 
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-100 flex items-center justify-center rounded-2xl animate-pulse">
      <span className="text-slate-400 font-medium">Memuat Peta...</span>
    </div>
  )
});

// Interface Data dari API (Number)
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

// Interface Form Edit (String agar mudah diedit manual)
interface EditFormState {
  id: string;
  name: string;
  category: string;
  lat: string | number; // Bisa string saat diketik
  lon: string | number;
  address: string;
  image: string;
  description: string;
}

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  
  // State form menggunakan tipe fleksibel agar input manual lancar
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  // --- HANDLERS ---

  const handleEditClick = (place: Place) => {
    setEditId(place.id);
    setError(null);
    // Konversi Lat/Lon ke String saat masuk mode edit agar input tidak kaku
    setEditForm({ 
      ...place, 
      lat: place.lat.toString(),
      lon: place.lon.toString(),
      address: place.address || "",
      image: place.image || "",
      description: place.description || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler Klik Peta
  const handleMapSelect = (lat: number, lon: number) => {
    if (editForm) {
      setEditForm({ ...editForm, lat: lat.toString(), lon: lon.toString() });
    }
  };

  // Handler Input Manual Koordinat
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'lat' | 'lon') => {
    const value = e.target.value;
    // Validasi regex: hanya angka, minus, dan titik
    if (/^-?[\d.]*$/.test(value) && editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setLoading(true);
    
    // Validasi sederhana
    if(!editForm.lat || !editForm.lon) {
       setError("Koordinat tidak boleh kosong.");
       setLoading(false);
       return;
    }

    // Siapkan payload: Kembalikan string Lat/Lon menjadi Number
    const payload = {
      ...editForm,
      lat: parseFloat(editForm.lat.toString()),
      lon: parseFloat(editForm.lon.toString())
    };

    try {
      const res = await fetch(`/api/places/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        // Update tabel lokal dengan data yang sudah di-parse ke number
        setPlaces(places.map(p => p.id === editForm.id ? { ...payload, id: editForm.id } : p));
        setEditId(null);
        setEditForm(null);
      } else {
        throw new Error("Gagal menyimpan perubahan");
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
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
    setError(null);
  };

  // Style Variables (Sama dengan InputPage)
  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-800 transition-all outline-none text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/50";
  const labelClass = "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500";

  // --- RENDER MODE EDIT (TAMPILAN MIRIP ADD PAGE) ---
  if (editId && editForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header Edit */}
          <header className="border-b border-slate-200 pb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Edit <span className="text-indigo-600">Lokasi</span>
              </h1>
              <p className="mt-2 text-slate-500">Perbarui informasi dan titik koordinat.</p>
            </div>
            <button onClick={handleCancel} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition text-slate-600">
               <XCircle size={24} />
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAP SECTION (Kiri) */}
            <section className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="rounded-3xl shadow-sm border border-white bg-white p-2 overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-3 bg-indigo-600 rounded-t-2xl text-white">
                  <MapPin size={20} />
                  <h2 className="font-bold tracking-wide">Update Posisi</h2>
                </div>
                <div className="h-[450px] w-full relative rounded-b-2xl overflow-hidden border-x border-b border-slate-50">
                  <MapInput 
                    onLocationSelect={handleMapSelect}
                    inputLat={parseFloat(editForm.lat.toString())}
                    inputLon={parseFloat(editForm.lon.toString())}
                  />
                </div>
                <div className="p-4 flex gap-2 items-start bg-indigo-50/50">
                  <Info size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-indigo-800 font-semibold leading-relaxed">
                    Geser marker atau ketik koordinat manual untuk mengubah lokasi.
                  </p>
                </div>
              </div>
            </section>

            {/* FORM SECTION (Kanan) */}
            <form onSubmit={handleSaveEdit} className="lg:col-span-7 space-y-6">
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} /> <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              <div className="rounded-3xl p-8 shadow-sm border border-white bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="md:col-span-2">
                    <label className={labelClass}>Nama Tempat</label>
                    <input 
                      className={inputClass} 
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      required 
                    />
                  </div>

                  {/* EDITABLE LATITUDE */}
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      className={`${inputClass} font-mono`}
                      value={editForm.lat} 
                      onChange={(e) => handleCoordinateChange(e, 'lat')}
                    />
                  </div>

                  {/* EDITABLE LONGITUDE */}
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input 
                      type="text"
                      inputMode="decimal"
                      className={`${inputClass} font-mono`}
                      value={editForm.lon} 
                      onChange={(e) => handleCoordinateChange(e, 'lon')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Kategori Lokasi</label>
                    <select 
                      className={inputClass} 
                      value={editForm.category}
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      required
                    >
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
                        value={editForm.image}
                        onChange={e => setEditForm({...editForm, image: e.target.value})}
                      />
                    </div>
                  </div>

                  {editForm.image && (
                    <div className="md:col-span-2 border-2 border-slate-50 rounded-2xl overflow-hidden">
                      <img src={editForm.image} 
                        alt="Preview" 
                        className="w-full h-44 object-cover" 
                        onError={(e) => e.currentTarget.src = "https://via.placeholder.com/600x300?text=Error"} 
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelClass}>Alamat Lengkap</label>
                    <textarea 
                      className={`${inputClass} min-h-[80px]`} 
                      value={editForm.address}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>Deskripsi</label>
                    <textarea 
                      className={`${inputClass} min-h-[100px]`} 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-6 border-t border-slate-100">
                  <button type="button" onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                    <XCircle size={20} /> Batal
                  </button>
                  <button disabled={loading} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50">
                    {loading ? "Menyimpan..." : <><Save size={20} /> Simpan Perubahan</>}
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Kelola data lokasi GIS Anda.</p>
          </div>
          <Link href="/admin/input" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
            <Plus size={20} /> Tambah Data
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Tempat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Kategori</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Koordinat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-5 font-bold text-slate-700">
                      {place.name}
                      {place.image && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">IMG</span>}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                        place.category === 'wisata' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        place.category === 'hotel' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        place.category === 'cafe' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                        {place.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-mono">
                      {Number(place.lat).toFixed(5)}, <br/> {Number(place.lon).toFixed(5)}
                    </td>
                    <td className="p-5 text-slate-500 text-sm truncate max-w-[200px]">
                      {place.address || "-"}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(place)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(place.id, place.name)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {places.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Info size={32} />
              </div>
              <p className="text-slate-500 font-medium">Belum ada data lokasi yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}