"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BarChart3,
  Hotel,
  Coffee,
  Plane,
} from 'lucide-react';

// Interface Data dari API (Number)
interface Place {
  id: string;
  name: string;
  category: string;
  lat: number | string;
  lon: number | string;
  address?: string;
  image?: string;
  description?: string;
}

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => {
        setPlaces(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  // --- HITUNG STATISTIK ---
  const totalData = places.length;
  const hotelCount = places.filter(p => p.category === 'hotel').length;
  const cafeCount = places.filter(p => p.category === 'cafe').length;
  const wisataCount = places.filter(p => p.category === 'wisata').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-2">Statistik data lokasi GIS Kota Blitar</p>
          </div>
        </div>

        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Data Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Data</p>
                <p className="text-5xl font-extrabold text-slate-900 mt-4">{totalData}</p>
              </div>
              <div className="bg-indigo-100 p-5 rounded-3xl">
                <BarChart3 size={40} className="text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Hotel Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Hotel</p>
                <p className="text-5xl font-extrabold text-slate-900 mt-4">{hotelCount}</p>
                <p className="text-sm text-slate-400 mt-3">{totalData > 0 ? ((hotelCount / totalData) * 100).toFixed(1) : 0}% dari total</p>
              </div>
              <div className="bg-blue-100 p-5 rounded-3xl">
                <Hotel size={40} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Cafe Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Cafe & Resto</p>
                <p className="text-5xl font-extrabold text-slate-900 mt-4">{cafeCount}</p>
                <p className="text-sm text-slate-400 mt-3">{totalData > 0 ? ((cafeCount / totalData) * 100).toFixed(1) : 0}% dari total</p>
              </div>
              <div className="bg-orange-100 p-5 rounded-3xl">
                <Coffee size={40} className="text-orange-600" />
              </div>
            </div>
          </div>

          {/* Wisata Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Wisata</p>
                <p className="text-5xl font-extrabold text-slate-900 mt-4">{wisataCount}</p>
                <p className="text-sm text-slate-400 mt-3">{totalData > 0 ? ((wisataCount / totalData) * 100).toFixed(1) : 0}% dari total</p>
              </div>
              <div className="bg-purple-100 p-5 rounded-3xl">
                <Plane size={40} className="text-purple-600" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}