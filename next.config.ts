/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: Ini membolehkan deploy meski ada error ESLint
    ignoreDuringBuilds: true,
  },
  // Jika pakai TypeScript dan ada error tipe data
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Tambahkan domain gambar eksternal agar Next/Image bisa memuatnya
    domains: ['lh3.googleusercontent.com', 'cf.bstatic.com', 'firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig