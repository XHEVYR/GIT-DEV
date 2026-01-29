// "use client";
// import dynamic from 'next/dynamic';
// import Link from 'next/link';

// // Wajib pakai dynamic import biar tidak error SSR
// const Map = dynamic(() => import('@/components/map'), { ssr: false });

// export default function PetaPage() {
//   return (
//     <div className="h-screen w-full flex flex-col">
//       <nav className="bg-white p-4 text-indigo-600 font-bold flex justify-between items-center">
//         <span className="text-indigo-600 px-1 py-2 font-bold tracking-tight">GIS KOTA BLITAR</span>
//         <Link href="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold tracking-tight hover:bg-purple-800 transition">
//           Login
//         </Link>
//       </nav>
//       <div className="flex-1">
//         <Map />
//       </div>
//     </div>
//   );
// }