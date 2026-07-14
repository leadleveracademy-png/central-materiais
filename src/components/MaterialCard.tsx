"use client";

import Image from "next/image";
import { Material } from "@/lib/supabase";

export default function MaterialCard({
  material,
  onClick,
}: {
  material: Material;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {material.imagem_capa ? (
          <Image
            src={material.imagem_capa}
            alt={material.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-card)] flex items-center justify-center">
            <span className="text-[var(--text-secondary)] text-4xl">📄</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {material.palavra_chave && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
            style={{ background: "var(--accent-gradient)" }}
          >
            {material.palavra_chave}
          </span>
        )}
        <span className="absolute bottom-4 left-4 text-[var(--accent)] font-bold text-sm tracking-wider uppercase">
          Resgatar Material →
        </span>
      </div>
      <div className="p-4 bg-[var(--bg-card)] group-hover:bg-[var(--bg-card-hover)] transition-colors">
        <h3 className="font-bold text-lg leading-tight mb-2 text-[var(--text-primary)]">
          {material.titulo}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {material.descricao}
        </p>
      </div>
    </button>
  );
}
