"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, MapPin } from "lucide-react"; // Import icon agar senada

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession(); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // === LOGIKA AUTH (Sama seperti sebelumnya) ===
  useEffect(() => {
    signOut({ redirect: false }); 
  }, []); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false, 
      });

      if (res?.error) {
        setError("Username atau Password Salah!");
        setLoading(false);
      } else if (res?.ok) {
        router.push("/admin"); 
        router.refresh(); 
      } else {
        setError("Gagal menghubungi server.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error Catch:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    // Background disamakan dengan dashboard (slate-50)
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      {/* Card Container: Rounded-3xl dan shadow-sm agar mirip card dashboard */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 w-full max-w-md transition-all hover:shadow-lg">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition duration-300">
            <Lock className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Portal</h1>
          <div className="flex items-center justify-center gap-1 mt-2 text-slate-500">
            <MapPin size={14} />
            <p className="text-sm font-medium">GIS Kota Blitar</p>
          </div>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 placeholder:text-slate-400"
              placeholder="Masukkan username"
              onChange={(e) => setForm({...form, username: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 placeholder:text-slate-400"
              placeholder="Masukkan password"
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition shadow-md hover:shadow-indigo-200 disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
               <>
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Memproses...
               </>
            ) : "MASUK DASHBOARD"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 font-medium transition group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Peta Utama
          </Link>
        </div>

      </div>
    </div>
  );
}