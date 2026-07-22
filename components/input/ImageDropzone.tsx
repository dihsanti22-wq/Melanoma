"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/inference/constants";
import { formatFileSize } from "@/lib/utils";

interface ImageDropzoneProps {
  onFileAccepted: (file: File, previewUrl: string) => void;
  onError?:       (message: string) => void;
  isDisabled?:    boolean;
}

export function ImageDropzone({ onFileAccepted, onError, isDisabled = false }: ImageDropzoneProps) {
  const [preview,  setPreview]  = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0]?.code;
        if (code === "file-too-large")    onError?.(`File terlalu besar. Maks ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`);
        else if (code === "file-invalid-type") onError?.("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
        else                               onError?.("File tidak dapat diterima.");
        return;
      }
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      onFileAccepted(file, url);
    },
    [preview, onFileAccepted, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED_IMAGE_TYPES, maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES, disabled: isDisabled,
  });

  // Dynamic border/bg via CSS variables
  const borderColor = isDragActive
    ? "var(--dropzone-border-active)"
    : preview
    ? "var(--dropzone-border-filled)"
    : "var(--dropzone-border-idle)";

  const bgColor = isDragActive ? "var(--dropzone-bg-active)" : "var(--dropzone-bg-idle)";

  return (
    <div>
      {/* Outer motion.div: visual animation only — no getRootProps to avoid type conflict */}
      <motion.div
        animate={{ borderColor, backgroundColor: bgColor }}
        transition={{ duration: 0.2 }}
        className="rounded-xl overflow-hidden"
        style={{ border: `1.5px dashed ${borderColor}` }}
      >
        {/* Inner div: owns all dropzone event handlers */}
        <div
          {...getRootProps()}
          id="image-dropzone"
          className={`relative cursor-pointer outline-none ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          style={{ minHeight: preview ? "220px" : "160px" }}
        >
          <input {...getInputProps()} id="image-file-input" />

          <AnimatePresence mode="wait">
            {preview ? (
              /* ── Preview ── */
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview} alt="Preview citra dermoskopi"
                  className="w-full object-contain max-h-56 rounded-xl"
                  style={{ background: "var(--bg-code)" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                  style={{ background: "var(--bg-overlay)" }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: "var(--accent-teal-dim)", border: "1px solid var(--ring-teal)", color: "var(--accent-teal)" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Ganti Gambar
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Empty / Drag ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 px-6 text-center"
              >
                <motion.div
                  animate={isDragActive ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--bg-badge)", border: "1px solid var(--border-subtle)" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: isDragActive ? "var(--dropzone-icon-color-active)" : "var(--dropzone-icon-color)" }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </motion.div>

                <AnimatePresence mode="wait">
                  {isDragActive ? (
                    <motion.p
                      key="drag-hint"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-sm font-semibold" style={{ color: "var(--accent-teal)" }}
                    >
                      Lepas untuk upload!
                    </motion.p>
                  ) : (
                    <motion.div key="idle-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                        Drag &amp; drop citra di sini
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        atau{" "}
                        <span className="cursor-pointer hover:underline" style={{ color: "var(--accent-teal)" }}>
                          browse file
                        </span>
                      </p>
                      <p className="text-xs mt-3" style={{ color: "var(--text-placeholder)" }}>
                        JPG · PNG · WebP · Maks {formatFileSize(MAX_FILE_SIZE_BYTES)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* File info chip */}
      <AnimatePresence>
        {fileName && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden mt-2"
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "var(--accent-teal-dim)", border: "1px solid var(--ring-teal)" }}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--accent-teal)" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="text-xs font-medium truncate flex-1" style={{ color: "var(--accent-teal)" }}>{fileName}</span>
              <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--text-muted)" }}>{fileSize}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
