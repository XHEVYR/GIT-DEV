'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

//Titik Awal
const DEFAULT_LAT = -8.098064;
const DEFAULT_LON = 112.165140;

const customIcon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e40af;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23grad)' stroke='white' stroke-width='2' d='M16 2C9 2 3 8 3 16c0 8 13 22 13 22s13-14 13-22c0-8-6-14-13-14z'/%3E%3Ccircle cx='16' cy='16' r='5' fill='white'/%3E%3C/svg%3E",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
  shadowSize: [0, 0],
});

interface MapInputProps {
  onLocationSelect: (lat: number, lon: number) => void;
  initialLat?: number;
  initialLon?: number;
}

export default function MapInput({ onLocationSelect, initialLat, initialLon }: MapInputProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Menyimpan versi terbaru dari fungsi onLocationSelect tanpa memicu re-render useEffect
  const onLocationSelectRef = useRef(onLocationSelect);
  
  // Selalu update ref setiap kali props berubah
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const startLat = initialLat || DEFAULT_LAT;
      const startLon = initialLon || DEFAULT_LON;

      // Inisialisasi Peta
      mapInstance.current = L.map(mapRef.current, {
        zoomAnimation: false
      }).setView([startLat, startLon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // Fungsi Helper untuk Update Marker
      const updateMarker = (lat: number, lng: number) => {
        if (!mapInstance.current) return;

        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng], { 
            icon: customIcon,
            draggable: true 
          }).addTo(mapInstance.current);

          // Event Drag
          markerRef.current.on('dragend', (event) => {
            const position = event.target.getLatLng();
            // Panggil fungsi dari Ref, bukan dari props langsung
            onLocationSelectRef.current(position.lat, position.lng);
            mapInstance.current?.panTo(position);
          });
        } else {
          markerRef.current.setLatLng([lat, lng]);
        }
        
        // Panggil fungsi dari Ref
        onLocationSelectRef.current(lat, lng);
      };

      // Set marker awal jika mode edit
      if (initialLat && initialLon) {
        updateMarker(initialLat, initialLon);
      }

      // Event Klik Peta
      mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updateMarker(lat, lng);
      });
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [initialLat, initialLon]); 

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full z-0 relative outline-none" 
      style={{ minHeight: '100%', background: '#f8fafc' }} 
    />
  );
}