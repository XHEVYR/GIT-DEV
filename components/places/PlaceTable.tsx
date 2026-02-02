"use client";
import { Edit, Trash2, Info } from 'lucide-react';
import { Place } from '@/types'; // Import dari langkah 1

interface PlaceTableProps {
  data: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string, name: string) => void;
}

export default function PlaceTable({ data, onEdit, onDelete }: PlaceTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <div className="flex flex-col items-center gap-2">
           <Info size={24} className="text-slate-300"/>
           <span>Data tidak ditemukan.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Tempat</th>
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Kategori</th>
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Koordinat</th>
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</th>
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((place) => (
              <tr key={place.id} className="hover:bg-slate-50/80 transition">
                <td className="p-5 font-bold text-slate-700">
                  {place.name}
                  {place.image && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">IMG</span>}
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                    place.category === 'wisata' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    place.category === 'hotel' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-orange-50 text-orange-700 border-orange-100' // Cafe default
                  }`}>
                    {place.category.toUpperCase()}
                  </span>
                </td>
                <td className="p-5 text-slate-500 text-xs font-mono">
                  {Number(place.lat).toFixed(5)}, <br/> {Number(place.lon).toFixed(5)}
                </td>
                <td className="p-5 text-slate-500 text-sm truncate max-w-[200px]">
                  {place.address || "-"}
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(place)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition border border-indigo-100">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(place.id, place.name)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}