'use client';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- BAGIAN FIX ICON MARKER ---
// Kode ini wajib ada di Next.js agar icon marker tidak broken image
const iconFix = () => {
  // Hapus getter default
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Set ulang path gambar ke CDN yang stabil
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Jalankan fix icon sekali saat komponen di-mount
iconFix();
// ------------------------------

// Komponen Child untuk menangani logika Peta
function LocationMarker({ onSelect, position }: { onSelect: any, position: [number, number] | null }) {
  const map = useMap();

  // Efek 1: Jika posisi berubah (karena ketik manual), terbangkan peta ke sana
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1.5 // Animasi halus
      });
    }
  }, [position, map]);

  // Event: Saat peta diklik, panggil fungsi onSelect (mengisi form)
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
      // Animasi marker pindah ke titik klik
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Tampilkan Marker hanya jika posisi ada
  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// Props yang diterima komponen utama
interface MapInputProps {
  onLocationSelect: (lat: number, lon: number) => void;
  inputLat?: number;
  inputLon?: number;
}

export default function MapInput({ onLocationSelect, inputLat, inputLon }: MapInputProps) {
  // Tentukan posisi marker: Prioritas dari Input Manual, jika tidak ada null
  const position: [number, number] | null = (inputLat && inputLon) 
    ? [inputLat, inputLon] 
    : null;

  // Koordinat Default (Misal: Monas, Jakarta) untuk tampilan awal jika belum ada data
  const defaultCenter: [number, number] = [-8.097957655926255, 112.16521686600117];

  return (
    <MapContainer 
      center={position || defaultCenter} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 1 }} // zIndex penting agar marker tidak tertutup layer lain
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {/* Panggil komponen Logic di dalam MapContainer */}
      <LocationMarker onSelect={onLocationSelect} position={position} />
    </MapContainer>
  );
}