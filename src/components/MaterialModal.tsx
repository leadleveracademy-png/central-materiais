"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Material } from "@/lib/supabase";

export default function MaterialModal({
  material,
  onClose,
}: {
  material: Material;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl mx-4 my-8 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          ✕ Fechar
        </button>

        <div className="pt-12 text-center mb-8">
          <p className="text-[var(--accent)] text-xs tracking-[0.15em] font-medium mb-4">
            ✦ Nathan Wexel - Mentor de Vendas &amp; IA para personais e nutricionistas - @nathan_wexell
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold uppercase leading-tight"
            style={{ fontFamily: "Times, Georgia, serif" }}
          >
            {material.titulo}
          </h2>
          <div className="w-20 h-1 mx-auto mt-6 rounded-full" style={{ background: "var(--accent-gradient)" }} />
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl p-6 md:p-10">
          <div className="markdown-content">
            <ReactMarkdown>{material.conteudo_completo}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
