"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useCallback } from 'react';
import L from 'leaflet';

interface MapInputProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

const icon = L.icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e40af;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23grad)' stroke='white' stroke-width='2' d='M16 2C9 2 3 8 3 16c0 8 13 22 13 22s13-14 13-22c0-8-6-14-13-14z'/%3E%3Ccircle cx='16' cy='16' r='5' fill='white'/%3E%3C/svg%3E",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
  shadowSize: [0, 0],
});

function MapClickHandler({ onLocationSelect }: any) {
  const handleMapClick = useCallback((e: any) => {
    const { lat, lng } = e.latlng;
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  useMapEvents({
    click: handleMapClick,
  });
  return null;
}

function DraggableMarker({ position, onDragEnd }: any) {
  const markerRef = useRef<any>(null);

  const handleDragEnd = useCallback(() => {
    if (markerRef.current) {
      const { lat, lng } = markerRef.current.getLatLng();
      onDragEnd(lat, lng);
    }
  }, [onDragEnd]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
}

export default function MapInput({ onLocationSelect }: MapInputProps) {
  const [position, setPosition] = useState<[number, number]>([-8.098064989795585, 112.16514038306394]);
  
  const handleDragEnd = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} zoomAnimation={false}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; OpenStreetMap contributors'
        maxZoom={19}
        maxNativeZoom={19}
      />
      
      <DraggableMarker position={position} onDragEnd={handleDragEnd} />
      
      <MapClickHandler onLocationSelect={handleMapClick} />
    </MapContainer>
  );
}
