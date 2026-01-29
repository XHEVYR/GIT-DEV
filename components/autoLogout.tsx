"use client";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AutoLogout() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // LOGIKA BARU:
    // Logout HANYA JIKA:
    // 1. Sedang Login
    // 2. BUKAN di folder admin
    // 3. BUKAN di folder auth (login)
    // 4. DAN BUKAN DI HALAMAN UTAMA ("/") <--- INI PENGECUALIANNYA
    
    if (session && 
        !pathname.startsWith("/admin") && 
        !pathname.startsWith("/auth") && 
        pathname !== "/" // <-- Admin boleh ada di sini
    ) {
      console.log("Admin tersesat ke halaman yang tidak dikenal -> Logout.");
      signOut({ redirect: false });
    }
  }, [pathname, session]);

  return null;
}