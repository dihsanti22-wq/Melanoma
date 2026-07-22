import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Header Keamanan & CORS untuk WASM/WebGPU ────────────────────────────
  async headers() {
    return [
      {
        // Header COOP/COEP wajib untuk SharedArrayBuffer
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        // Header khusus file WASM — MIME type benar agar browser menerima
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
        // Header khusus untuk file model ONNX — caching permanen
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

