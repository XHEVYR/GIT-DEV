"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Define proper type for places
interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
}

// Fix Icon Marker Hilang
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);

  // Fetch data saat peta dibuka
  useEffect(() => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data: Place[]) => setPlaces(data));
  }, []);

  return (
    <MapContainer center={[-7.8166, 112.0117]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]} icon={icon}>
          <Popup>
            <b>{place.name}</b><br/>{place.category}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}