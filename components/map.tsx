"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo, useRef } from 'react';
import L from 'leaflet';

// --- TIPE DATA & ICON SAMA SEPERTI SEBELUMNYA ---
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

const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Icon Cluster (Sesuai kode Anda)
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let color = '#51aada'; 
  if (count > 100) color = '#e41c3d';
  else if (count > 50) color = '#f97316'; 
  else if (count > 20) color = '#eab308'; 

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40),
    iconAnchor: L.point(20, 20),
  });
};

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State: Set kategori yang AKTIF (default kosong dulu, nanti diisi effect)
  // Kita pakai Set biar lookup lebih cepat, tapi array string juga oke.
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch('/api/places');
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        setPlaces(validData);
        
        // Default: semua kategori aktif di awal
        const allCats = new Set(validData.map((p: Place) => p.category));
        setVisibleCategories(allCats as Set<string>);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // Ambil list kategori unik untuk membuat list di LayersControl
  const categories = useMemo(() => {
    return Array.from(new Set(places.map(p => p.category)));
  }, [places]);

  // Handler: Menambah/Menghapus kategori dari state visibilitas
  const toggleCategory = (cat: string, isVisible: boolean) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (isVisible) newSet.add(cat);
      else newSet.delete(cat);
      return newSet;
    });
  };

  if (loading) return <div>Loading map...</div>;

  return (
    <MapContainer 
      center={[-8.098064989795585, 112.16514038306394]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="topright">
        
        {/* Base Maps */}
        <LayersControl.BaseLayer checked name="Peta Jalan (OSM)">
           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Peta Satelit">
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" attribution='&copy; OSM'/>
        </LayersControl.BaseLayer>

        {/* --- TRIK SAKLAR LAYER CONTROL --- */}
        {/* Kita buat Overlay kosong untuk setiap kategori. 
            Isinya hanya LayerGroup kosong yang mendeteksi event 'add' (dicentang) dan 'remove' (dihapus).
            Ini tidak merender marker, hanya mengubah state. */}
        {categories.map((category) => (
          <LayersControl.Overlay checked name={category} key={category}>
            <LayerGroup 
              eventHandlers={{
                add: () => toggleCategory(category, true),
                remove: () => toggleCategory(category, false)
              }}
            />
          </LayersControl.Overlay>
        ))}

      </LayersControl>

      {/* --- MARKER ASLI (DI LUAR LAYERS CONTROL) --- */}
      {/* Marker ditaruh disini agar selalu ada di memori ClusterGroup (tidak terhapus).
          Visibilitas diatur via opacity berdasarkan state di atas. */}
      <MarkerClusterGroup 
        chunkedLoading 
        iconCreateFunction={createClusterCustomIcon}
        maxClusterRadius={80}
      >
        {places.map((place) => {
          // Cek apakah kategori marker ini ada di set visibleCategories
          const isVisible = visibleCategories.has(place.category);

          return (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lon]} 
              icon={icon}
              // JIKA HIDDEN: Opacity 0 (tak terlihat) & tak bisa diklik.
              // TAPI marker tetap ada, jadi Cluster menghitungnya!
              opacity={isVisible ? 1 : 0}
              interactive={isVisible}
            >
              <Popup>
                <div className="w-60">
                  {place.image && (
                    <img src={place.image}
                    alt={place.name} 
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    referrerPolicy="no-referrer"
                    loading="lazy" />
                  )}
                  <b>Nama:</b> {place.name}<br/>
                  <b>Kategori:</b> {place.category}<br/>
                  <b>Alamat:</b> {place.address}<br/>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

    </MapContainer>
  );
}