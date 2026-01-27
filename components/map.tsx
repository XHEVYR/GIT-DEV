"use client";

import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
import L from 'leaflet';

// Define proper type for places
interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  address: string;
  lat: number;
  lon: number;
}

// Fix Icon Marker Hilang
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch('/api/places');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        console.log('Data dari API:', data);
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetch:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // 1. EKSTRAKSI KATEGORI UNIK
  // Kita menggunakan useMemo agar tidak menghitung ulang setiap render kecuali places berubah
  const categories = useMemo(() => {
    // Ambil semua kategori, masukkan ke Set biar unik, lalu jadikan array lagi
    const uniqueCats = new Set(places.map(p => p.category));
    return Array.from(uniqueCats);
  }, [places]);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: "100%", width: "100%" }}>
      
      {/* Opsi Tambahan: Masukkan TileLayer ke BaseLayer agar rapi di control panel */}
      <LayersControl position="topright">
        
        <LayersControl.BaseLayer checked name="Peta Satelit">
          <TileLayer 
            url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Peta Jalan (OSM)">
           <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </LayersControl.BaseLayer>

        

        {/* 2. LOOPING KATEGORI UNTUK OVERLAY */}
        {categories.map((category) => (
          <LayersControl.Overlay checked name={category} key={category}>
            <LayerGroup>
              {/* 3. FILTER DATA BERDASARKAN KATEGORI */}
              {places
                .filter((place) => place.category === category)
                .map((place) => (
                  <Marker key={place.id} position={[place.lat, place.lon]} icon={icon}>
                    <Popup>
                      <div className="w-60">
                        {place.image && (
                          <img 
                            src={place.image} 
                            alt={place.name} 
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <b>Nama:</b> {place.name}<br/>
                        <b>Kategori:</b> {place.category}<br/>
                        <b>Alamat:</b> {place.address}<br/>
                        <b>Keterangan:</b> {place.description}<br/>
                      </div>
                    </Popup>
                  </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        ))}

      </LayersControl>
    </MapContainer>
  );
}