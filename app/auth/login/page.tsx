"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession(); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // === PERBAIKAN DI SINI ===
  useEffect(() => {
    // Jalankan perintah logout HANYA saat halaman baru dibuka (Mounting).
    // Array kosong [] artinya: "Jangan jalankan lagi meskipun status berubah jadi login sukses"
    signOut({ redirect: false }); 
  }, []); 
  // ========================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Kita pakai redirect: false agar bisa handle error manual
    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false, 
    });

    if (res?.error) {
      setError("Username atau Password Salah!");
      setLoading(false);
    } else {
      // Login Sukses! 
      // Karena useEffect di atas dikunci pakai [], dia tidak akan mengganggu proses ini.
      router.push("/admin"); 
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Login Admin</h1>
          <p className="text-xs text-gray-500 mt-1">GIS Kota Blitar</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Username</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition text-black"
              onChange={(e) => setForm({...form, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition text-black"
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "MASUK DASHBOARD"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 hover:underline">
            ← Kembali ke Peta Utama
          </Link>
        </div>
      </div>
    </div>
  );
}