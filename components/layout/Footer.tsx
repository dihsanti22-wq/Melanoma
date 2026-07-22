"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const DISCLAIMER =
  "Sistem ini merupakan alat bantu skrining awal dan BUKAN pengganti diagnosis medis oleh dokter spesialis. Selalu konsultasikan hasil kepada tenaga medis yang berkompeten.";

export function Footer() {
  return (
    <footer
      className="relative mt-20"
      style={{ borderTop: "1px solid var(--footer-border)" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent-teal), transparent)" }}
      />

      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>
                Melano<span style={{ color: "var(--accent-teal)" }}>Scan</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--footer-text)" }}>
              Sistem deteksi lesi dermoskopi berbasis YOLOv11 untuk skrining awal tumor kulit. Dikembangkan untuk penelitian akademik Universitas Nusa Putra.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/",       label: "Beranda" },
                { href: "/upload", label: "Upload Citra" },
                { href: "/camera", label: "Deteksi Kamera" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "var(--footer-text)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Penelitian
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--footer-text)" }}>
              <li>D. Ihsan Maulana</li>
              <li>Teknik Informatika</li>
              <li>Universitas Nusa Putra</li>
              <li className="font-mono text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                NIM: 20220040069 · 2026
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl p-4 mb-8 flex gap-3 items-start"
          style={{
            background: "var(--disclaimer-bg)",
            border: "1px solid var(--disclaimer-border)",
          }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "var(--disclaimer-icon)" }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "var(--disclaimer-text)" }}>
            {DISCLAIMER}
          </p>
        </motion.div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--divider)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 MelanoScan · Universitas Nusa Putra · MIT License
          </p>
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent-teal)", animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            YOLOv11 · ONNX Runtime Web · Next.js 15
          </div>
        </div>
      </div>
    </footer>
  );
}
