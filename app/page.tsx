"use client";
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export type data = {
    id: string;
    nama: string;
    kategori: string;
    alamat: string;
    lat: number;
    lon: number;
};

const hotelIcon = L.icon({
  // iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'data:image/png;base64,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',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fnbIcon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADcklEQVR4nO2WX0hTURzHr9k/K4qiiB4CpcKiDImglyArggp9K3sIgqCCCJJeIsLo31M9FPXaSylWWNju3XbFLd00/5T5J9dq7pzde5xoSf+GVKSmfePeo+Hmhtbu3Iz7he/Lvuzu8z3nd+6ZIJgyZcrUf6mKIFkjMWqVGHVKrHO9MFNU3t2dITJ6SVTJD4lRjHpIZPRWude7SEhlSQopkFTKxoGHWVRpj1WlR4RUkzUQWCeqRI4FPsEqqRGDdGOyuQWpt3eBPi6MDkwZPmKsZEIWJwdeIQUiI8F/AI/YDfpOGysAadMCblF92SKjVXGDT3StqCibEwZe9f7VQm1cJEYHEwCP0UP+U39bKcoSw8C1rdW2WGKkL1Hg0sSx+mRRSdFFYFZc8Dbmz5VUUj9t4CzS5KVF9W/7e/BgcKm2lZJKhpMHT0d3g4yIjJTIhKyYEryoBk6IjH5MOjiLOB+MftTYJi2QbFBpEpsFJLMATa0CVuZHe9M1fBFzEXLkgDUehttnhY35QUgpvlXvxXBJBn4+Wog+dx6aXt9NnQIye4tQ4Abg3gncFYD7AmAV8MuWjv72o0DXFSBwHiidx3OJ5z/aCgF2BSPe0+iz7sLbZ2fhoA2JL2BXPPC2FOOrIwvD9gyEmgs5pFIMlMwG7nFA7nTAd4rntg28QMVYlga8Oc4zS5aejUhz0VV/CNV+Z2IKvPDcwaC8bBzgqDsOcpDHq8JWWXfdJp65dkQUEADXWp45t/FM5J9rC+NpvazdwsYV6Gi9il+2WRPhNddkchBxLVASkdnnAOoFoG5PGKRu7XmBczwL2znuzhdFxhTQDuSIbU50eB0knUM+yQQeRMm1MXLnAWXRshNA7W7gYbRnp6H+zYP4CwTrC2PDj7k1H6hYGb7CY27eDVTlAJZoWR5QvTX696wCeury4y/Q78ievECCHHq6eWYX6HPnGTFCB5JWoK39evwFXD4Zw/b50w7/wbU96qv0rwtobvCWYUhePK2jY1c8xl5kDtKA3tp9se8DAzxQuRwdbVdjXmKG/Beq6XQg0HQM36tWGwSepr9tPC2XYq66oQXG+6nfhdb2myDPT6K3bj8+V29Bv3O9Xm5QXvrn7AzJSzBQuUL/POTMQc+zfPiaz6Cl4zYctHHKv2d4gWRYMAswswDMAqZMmTIlpIp+A2gDVxNNjWoFAAAAAElFTkSuQmCC',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const cafeIcon = L.icon({
  iconUrl: 'data:image/png;base64,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',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const LayerController = ({ hotels, fnb, cafe }: { hotels: data[], fnb: any[], cafe: any[] }) => {
  const map = useMap();
  const [layerGroups] = useState({
    hotel: L.layerGroup().addTo(map),
    fnb: L.layerGroup().addTo(map),
    cafe: L.layerGroup().addTo(map),
  });

  // Add layer control
  useEffect(() => {
    const overlays = {
      'Hotel': layerGroups.hotel,
      'Food & Beverage': layerGroups.fnb,
      'Cafe': layerGroups.cafe,
    };
    L.control.layers({}, overlays).addTo(map);
  }, [map, layerGroups]);

  return (
    <>
      <LayerGroup ref={(el) => {
        if (el && layerGroups.hotel) {
          // Clear and repopulate
          layerGroups.hotel.clearLayers();
          hotels.forEach(hotel => {
            const marker = L.marker([hotel.lat, hotel.lon], { icon: hotelIcon });
            const popup = L.popup().setContent(
              `<strong>${hotel.nama}</strong><br/><strong>${hotel.kategori}</strong><br/>${hotel.alamat}`
            );
            marker.bindPopup(popup);
            layerGroups.hotel.addLayer(marker);
          });
        }
      }}>
      </LayerGroup>

      <LayerGroup ref={(el) => {
        if (el && layerGroups.fnb) {
          layerGroups.fnb.clearLayers();
          fnb.forEach(item => {
            const marker = L.marker([item.lat, item.lon], { icon: fnbIcon });
            const popup = L.popup().setContent(
              `<strong>${item.nama}</strong><br/><strong>${item.kategori}</strong><br/>${item.alamat}`
            );
            marker.bindPopup(popup);
            layerGroups.fnb.addLayer(marker);
          });
        }
      }}>
      </LayerGroup>

      <LayerGroup ref={(el) => {
        if (el && layerGroups.cafe) {
          layerGroups.cafe.clearLayers();
          cafe.forEach(item => {
            const marker = L.marker([item.lat, item.lon], { icon: cafeIcon });
            const popup = L.popup().setContent(
              `<strong>${item.nama}</strong><br/><strong>${item.kategori}</strong><br/>${item.alamat}`
            );
            marker.bindPopup(popup);
            layerGroups.cafe.addLayer(marker);
          });
        }
      }}>
      </LayerGroup>
    </>
  );
};

const Map=() => {
  const [hotels, setHotels] = useState<data[]>([]);
  const [fnb, setFnb] = useState<any[]>([]);
  const [cafe, setCafe] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/data-hotel.json')
      .then(response => response.json())
      .then(data => setHotels(data));
    fetch('/data-fnb.json')
      .then(response => response.json())
      .then(data => setFnb(data));
      fetch('/data-cafe.json')
      .then(response => response.json())
      .then(data => setCafe(data));
  }, []);
  return (
    <MapContainer center={[-8.098064989795585, 112.16514038306394]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
      attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png">
      </TileLayer>
      
      <LayerController hotels={hotels} fnb={fnb} cafe={cafe} />
    </MapContainer>
  );
}
export default Map;
