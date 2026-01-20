export type Hotel = {
    id: string;
    nama: string;
    alamat: string;
    lat: number;
    lon: number;
};
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const hotelIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/139/139899.png',
  iconSize: [25, 25],
});

const Map=() => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [fnb, setFnb] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('public/data-hotel.json')
      .then(response => response.json())
      .then(data => setHotels(data));
    fetch('public/data-fnb.json')
      .then(response => response.json())
      .then(data => setFnb(data));
  }, []);
  return (
    <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
      attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
>
      {hotels.map((hotel) => (
        <Marker key={hotel.id} position={[hotel.lat, hotel.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{hotel.nama}</strong><br />
            {hotel.alamat}
          </Popup>
        </Marker>
      ))}
      {fnb.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{place.nama}</strong><br />
            {place.alamat}
          </Popup>
        </Marker>
      ))}
</TileLayer>
    </MapContainer>
  );
}
    /* </MapContainer>
    <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
      attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png'
>
      {hotels.map((hotel) => (
        <Marker key={hotel.id} position={[hotel.lat, hotel.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{hotel.nama}</strong><br />
            {hotel.alamat}
          </Popup>
        </Marker>
      ))}
      {fnb.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]} icon={hotelIcon}>
          <Popup>
            <strong>{place.nama}</strong><br />
            {place.alamat}
          </Popup>
        </Marker>
      ))}
</TileLayer>
    </MapContainer>
  );
}; */
