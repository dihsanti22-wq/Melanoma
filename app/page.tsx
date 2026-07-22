"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ── Animation Variants ───────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};


const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ── Data ─────────────────────────────────────────────────────
const techSpecs = [
  { label: "Model",      value: "YOLOv11n" },
  { label: "Dataset",    value: "HAM10000" },
  { label: "Kelas",      value: "MEL · NV" },
  { label: "Input",      value: "640×640" },
  { label: "Inferensi",  value: "Client-Side" },
  { label: "Akselerasi", value: "WebGPU/WASM" },
];

const steps = [
  { num: "01", title: "Siapkan Citra",  desc: "Gunakan citra dermoskopi berkualitas baik, resolusi min. 224×224 px dengan pencahayaan merata." },
  { num: "02", title: "Pilih Metode",   desc: "Upload file lokal (JPG/PNG/WebP) atau aktifkan kamera perangkat untuk deteksi langsung." },
  { num: "03", title: "Jalankan AI",    desc: "Model YOLOv11 memproses citra sepenuhnya di browser Anda. Privat & cepat — tanpa server." },
  { num: "04", title: "Baca Hasil",     desc: "Lihat bounding box, kelas lesi, confidence score. Konsultasikan segera ke dokter spesialis." },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">

          {/* Animated background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(20,184,166,0.3), transparent 70%)" }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-48 -right-32 w-[700px] h-[700px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)" }}
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 py-24">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-teal-300 mb-8"
              style={{
                background: "rgba(20,184,166,0.08)",
                border: "1px solid rgba(20,184,166,0.25)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              Sistem Skrining Awal Tumor Kulit Berbasis AI
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl mb-6"
            >
              Deteksi Dini{" "}
              <span className="gradient-text">Lesi Melanoma</span>
              <br />
              <span className="text-neutral-300" style={{ fontWeight: 600 }}>
                dengan Kecerdasan Buatan
              </span>
            </motion.h1>

            {/* Desc */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-neutral-400 text-lg leading-relaxed mb-10"
            >
              MelanoScan menggunakan <strong className="text-neutral-200">YOLOv11</strong> yang dilatih
              pada <strong className="text-neutral-200">HAM10000</strong> untuk mendeteksi dan melokalisasi
              lesi <span className="text-danger font-medium">Melanoma</span> (ganas) dan{" "}
              <span className="text-safe font-medium">Melanocytic Nevus</span> (jinak) secara
              real-time di browser — tanpa server.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link
                href="/upload"
                id="hero-upload-btn"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                  boxShadow: "0 4px 20px rgba(20,184,166,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Mulai Upload Citra
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              <Link
                href="/camera"
                id="hero-camera-btn"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-neutral-200 font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:text-white hover:border-white/20"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Gunakan Kamera
              </Link>
            </motion.div>

            {/* Tech spec chips */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {techSpecs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-neutral-500">{spec.label}:</span>
                  <span className="text-teal-400 font-mono font-medium">{spec.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Feature Cards ──────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Upload Card */}
              <motion.article
                variants={fadeUp}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="gradient-border group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(20,184,166,0.05), rgba(15,23,42,0.95))",
                  border: "1px solid rgba(20,184,166,0.15)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)" }}
                >
                  <svg className="w-7 h-7 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Citra Dermoskopi</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Drag & drop atau pilih file citra dermoskopi (JPG, PNG, WebP). Deteksi lesi instan dengan bounding box dan confidence score.
                </p>
                <Link
                  href="/upload"
                  id="feature-upload-btn"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 group-hover:gap-3 transition-all"
                >
                  Mulai Upload
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </motion.article>

              {/* Camera Card */}
              <motion.article
                variants={fadeUp}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(15,23,42,0.95))",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
                >
                  <svg className="w-7 h-7 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Deteksi Kamera Real-Time</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Gunakan kamera perangkat, arahkan ke lesi kulit, dan tangkap frame untuk dianalisis YOLOv11 secara instan di browser.
                </p>
                <Link
                  href="/camera"
                  id="feature-camera-btn"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:gap-3 transition-all"
                >
                  Buka Kamera
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </motion.article>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────── */}
        <section className="section" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="mb-3">Cara Kerja Sistem</h2>
              <p className="text-neutral-500 max-w-md mx-auto">4 langkah sederhana dari citra ke hasil deteksi</p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  custom={i}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-7 left-full w-full h-px z-0"
                      style={{ background: "linear-gradient(90deg, rgba(20,184,166,0.3), transparent)" }}
                    />
                  )}
                  <div
                    className="relative z-10 p-6 rounded-2xl transition-all duration-300 hover:border-white/15"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                        style={{ background: "var(--color-teal-dim)", color: "var(--color-teal)", border: "1px solid var(--border-teal)" }}
                      >
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-heading)" }}>{step.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Class Cards ────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="mb-3">Kelas yang Dideteksi</h2>
              <p className="text-neutral-500 max-w-md mx-auto">Model YOLOv11 mengenali 2 jenis lesi kulit dari citra dermoskopi</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MEL */}
              <motion.article
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(244,63,94,0.04)", border: "1px solid rgba(244,63,94,0.15)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <h3 className="text-base font-bold text-white">Melanoma (MEL)</h3>
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-rose-400"
                    style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.2)" }}
                  >
                    GANAS
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  Kanker kulit paling mematikan berasal dari melanosit. Ditandai lesi asimetris, batas tidak tegas, warna heterogen. Membutuhkan penanganan segera.
                </p>
                <ul className="space-y-1.5">
                  {["Asimetris (A — Asymmetry)", "Batas tidak teratur (B — Border)", "Warna heterogen (C — Color)", "Diameter > 6mm (D — Diameter)"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>

              {/* NV */}
              <motion.article
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <h3 className="text-base font-bold text-white">Melanocytic Nevus (NV)</h3>
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-400"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    JINAK
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  Lesi jinak yang umum dikenal sebagai tahi lalat. Umumnya simetris, berbatas tegas, berwarna seragam. Tetap perlu dipantau secara berkala.
                </p>
                <ul className="space-y-1.5">
                  {["Simetris bentuknya", "Batas tegas dan teratur", "Warna seragam/homogen", "Tidak berubah signifikan"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </div>
          </div>
        </section>

        {/* ── CTA Bottom ─────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden text-center p-16"
              style={{
                background: "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(139,92,246,0.06))",
                border: "1px solid rgba(20,184,166,0.2)",
              }}
            >
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

              <h2 className="mb-4">Siap Melakukan Skrining?</h2>
              <p className="text-neutral-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Ingat — sistem ini adalah alat bantu skrining awal. Selalu konsultasikan hasil kepada dokter spesialis kulit untuk diagnosis yang akurat.
              </p>
              <Link
                href="/upload"
                id="cta-bottom-btn"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(20,184,166,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                  boxShadow: "0 4px 24px rgba(20,184,166,0.3)",
                }}
              >
                Mulai Sekarang — Gratis
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
