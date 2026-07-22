import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── ESLint & TypeScript: Abaikan saat build Vercel ──────────────────────
  // (ESLint tetap bisa dijalankan manual dengan: npm run lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Type check lokal via: npx tsc --noEmit
  },


  // ─── Header untuk WASM dan Model Cache ──────────────────────────────────
  // CATATAN: Tidak pakai COOP/COEP — header itu blokir WebGL!
  // Sawo project juga tidak pakai dan WebGL-nya jalan normal.

  async headers() {
    return [
      {
        // MIME type benar untuk .wasm agar browser terima
        source: "/:file*.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        // Cache permanen untuk file model ONNX (19MB, tidak perlu re-download)
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },


  // ─── Webpack: WASM support untuk onnxruntime-web ─────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Izinkan import file .wasm secara async
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Tambahkan rule untuk .wasm files agar tidak diproses oleh webpack
    // tapi diservé langsung dari public/
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },

  // ─── Optimasi Gambar ──────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // ─── Opsi Next.js 15 ─────────────────────────────────────────────────────
  reactStrictMode: true,
};

export default nextConfig;

