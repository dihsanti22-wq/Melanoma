"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

const navLinks = [
  { href: "/",       label: "Beranda" },
  { href: "/upload", label: "Upload Citra" },
  { href: "/camera", label: "Kamera Live" },
];

export function Navbar() {
  const pathname  = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
        style={{
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid var(--nav-border)` : "none",
          boxShadow: scrolled ? "var(--nav-shadow)" : "none",
        }}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="navbar-logo">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-500 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-500 to-violet-600 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <svg className="relative z-10 w-8 h-8 p-1.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span
                className="text-base font-bold tracking-tight transition-colors"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
              >
                Melano<span style={{ color: "var(--accent-teal)" }}>Scan</span>
              </span>
              <div className="text-[10px] leading-none -mt-0.5 hidden sm:block" style={{ color: "var(--text-muted)" }}>
                YOLOv11 AI Detection
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: isActive ? "var(--nav-active-text)" : "var(--nav-text)",
                    background: isActive ? "none" : "transparent",
                  }}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "var(--nav-active-bg)",
                        border: "1px solid var(--nav-active-border)",
                      }}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {/* CTA Button */}
            <Link
              href="/upload"
              id="navbar-cta-btn"
              className="ml-3 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--btn-primary-bg)",
                boxShadow: "var(--btn-primary-shadow)",
                color: "var(--btn-primary-text)",
              }}
            >
              Mulai Deteksi
            </Link>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
              title={theme === "dark" ? "☀️ Light Mode (ramah cetak)" : "🌙 Dark Mode"}
              className="ml-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: "var(--btn-ghost-bg)",
                border: "1px solid var(--btn-ghost-border)",
                color: "var(--btn-ghost-text)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.svg
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </nav>

          {/* Mobile — hamburger + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: "var(--nav-text)", background: "var(--btn-ghost-bg)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
              style={{ color: "var(--nav-text)", background: "var(--btn-ghost-bg)" }}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 origin-center" style={{ background: "var(--text-secondary)" }} />
              <motion.span animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block w-5 h-0.5 origin-center" style={{ background: "var(--text-secondary)" }} />
              <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 origin-center" style={{ background: "var(--text-secondary)" }} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden p-4"
          >
            <div
              className="rounded-2xl p-2 space-y-1 backdrop-blur-xl"
              style={{
                background: "var(--nav-bg)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-float)",
              }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={
                      pathname === link.href
                        ? { background: "var(--nav-active-bg)", color: "var(--nav-active-text)", border: "1px solid var(--nav-active-border)" }
                        : { color: "var(--text-secondary)", border: "1px solid transparent" }
                    }
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
