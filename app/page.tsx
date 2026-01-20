"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export type Hotel = {
    id: string;
    nama: string;
    kategori: string;
    alamat: string;
    lat: number;
    lon: number;
};

const hotelIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fnbIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjRkYyNzI3IiBkPSJNMTIuNSAwQzUuNTk2IDAgMCA1LjU5NiAwIDEyLjVjMCA3LjczMyAxMi41IDI4LjI2NyAxMi41IDI4LjI2N3MxMi41LTIwLjUzNCAxMi41LTI4LjI2N0MyNSA1LjU5NiAxOS40MDQgMCAxMi41IDB6TTEyLjUgMTcuMTg4Yy0yLjU5IDAgLTQuNjg4LTIuMDk4LTQuNjg4LTQuNjg4czIuMDk4LTQuNjg4IDQuNjg4LTQuNjg4YzIuNTkgMCA0LjY4OCAyLjA5OCA0LjY4OCA0LjY4OHMtMi4wOTggNC42ODgtNC42ODggNC42ODh6Ii8+PC9zdmc+',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const Map=() => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [fnb, setFnb] = useState<any[]>([]);
  useEffect(() => {
    fetch('/data-hotel.json')
      .then(response => response.json())
      .then(data => setHotels(data));
    fetch('/data-fnb.json')
      .then(response => response.json())
      .then(data => setFnb(data));
  }, []);
  return (
    <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
      attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png">
      </TileLayer>
{hotels.map((hotel) => (
        <Marker key={hotel.id} position={[hotel.lat, hotel.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{hotel.nama}</strong><br />
            <strong> {hotel.kategori}<br /></strong>
            {hotel.alamat}
          </Popup>
        </Marker>
      ))}
      {fnb.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]} icon={fnbIcon}>
          <Popup>
            <strong>{place.nama}</strong><br />
            <strong> {place.kategori}<br /></strong>
            {place.alamat}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
export default Map;
