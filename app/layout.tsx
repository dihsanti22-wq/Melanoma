// ============================================================
// app/layout.tsx
// Root Layout — Melanoma Detector
// ============================================================

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";


export const metadata: Metadata = {
  title: {
    default: "MelanoScan — Sistem Deteksi Lesi Melanoma Berbasis AI",
    template: "%s | MelanoScan",
  },
  description:
    "Sistem deteksi dini lesi Melanoma dan Melanocytic Nevus berbasis kecerdasan buatan menggunakan YOLOv11 pada citra dermoskopi. Dikembangkan sebagai alat bantu skrining awal tumor kulit.",
  keywords: [
    "melanoma",
    "deteksi lesi kulit",
    "dermoskopi",
    "YOLOv11",
    "kecerdasan buatan",
    "skrining tumor kulit",
    "melanocytic nevus",
    "AI dermatologi",
  ],
  authors: [
    {
      name: "D. Ihsan Maulana",
      url: "https://nusaputra.ac.id",
    },
  ],
  creator: "D. Ihsan Maulana — Universitas Nusa Putra",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "MelanoScan — Sistem Deteksi Lesi Melanoma Berbasis AI",
    description:
      "Deteksi dini lesi Melanoma dan Melanocytic Nevus menggunakan YOLOv11 pada citra dermoskopi.",
    siteName: "MelanoScan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Next.js 15: Viewport harus di-export secara terpisah dari metadata
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect ke CDN untuk WASM engine */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        {/* Preload ONNX model — browser mulai download segera, bukan nunggu JS */}
        <link
          rel="preload"
          href="/models/best.onnx"
          as="fetch"
          crossOrigin="anonymous"
        />
        {/* Preload WASM engine dari CDN */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/ort-wasm-simd-threaded.wasm"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Flash of Wrong Theme prevention — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var s=localStorage.getItem('melanoscan-theme');
              if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-theme',s);return;}
              if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');}
              else{document.documentElement.setAttribute('data-theme','dark');}
            }catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
