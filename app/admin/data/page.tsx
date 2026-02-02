"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from 'lucide-react';

// Import Komponen Clean Code kita
import SearchBar from "@/components/ui/searchbar";
import PlaceTable from "@/components//places/PlaceTable";
import PlaceForm from "@/components/places/PlaceForm";
import { Place } from "@/types";

export default function DataPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  
  // State untuk Edit Mode (Menyimpan data yang sedang diedit)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // 1. Fetch Data
  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => {
        const result = Array.isArray(data) ? data : [];
        setPlaces(result);
        setFilteredPlaces(result);
      });
  }, []);

  // 2. Logic Search
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPlaces(places);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = places.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.address?.toLowerCase().includes(lowerQuery) || 
      p.category.includes(lowerQuery)
    );
    setFilteredPlaces(results);
  };

  // 3. Logic Save Edit (Diterima dari PlaceForm)
  const handleSave = async (updatedData: Place) => {
    // Kirim ke API
    const res = await fetch(`/api/places/${updatedData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         ...updatedData,
         lat: parseFloat(updatedData.lat.toString()), // Pastikan number
         lon: parseFloat(updatedData.lon.toString())
      })
    });

    if (!res.ok) throw new Error("Gagal update database");

    // Update State Lokal (Optimistic UI)
    const newPlaces = places.map(p => p.id === updatedData.id ? updatedData : p);
    setPlaces(newPlaces);
    setFilteredPlaces(newPlaces);
    setEditingPlace(null); // Tutup form
  };

  // 4. Logic Delete (Diterima dari PlaceTable)
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus "${name}"?`)) {
       await fetch(`/api/places/${id}`, { method: 'DELETE' });
       const remaining = places.filter(p => p.id !== id);
       setPlaces(remaining);
       setFilteredPlaces(remaining);
    }
  };

  // --- RENDER UTAMA ---
  
  // Jika sedang mode edit, tampilkan FORM
  if (editingPlace) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <PlaceForm 
           initialData={editingPlace} 
           onSave={handleSave} 
           onCancel={() => setEditingPlace(null)} 
        />
      </div>
    );
  }

  // Jika normal, tampilkan TABEL
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Data <span className="text-indigo-600">Lokasi</span></h1>
            <p className="text-slate-500 mt-1">Kelola data lokasi GIS Anda.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="w-full sm:w-64">
                <SearchBar onSearch={handleSearch} placeholder="Cari lokasi..." />
             </div>
             <Link href="/admin/input" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg">
                <Plus size={20} /> Tambah
             </Link>
          </div>
        </div>

        {/* Tabel Data */}
        <PlaceTable 
           data={filteredPlaces} 
           onEdit={(place) => setEditingPlace(place)} 
           onDelete={handleDelete} 
        />

      </div>
    </div>
  );
}