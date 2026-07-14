"use client";

import { useEffect, useState } from "react";
import { supabase, Material } from "@/lib/supabase";
import MaterialCard from "@/components/MaterialCard";
import MaterialModal from "@/components/MaterialModal";

export default function Home() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("central_materiais")
      .select("*")
      .eq("status", "publicado")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMateriais(data || []);
        setLoading(false);
      });
  }, []);

  const filtrados = materiais.filter(
    (m) =>
      m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      m.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      (m.palavra_chave || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <header className="text-center mb-12">
        <p className="text-[var(--accent)] text-xs tracking-[0.15em] font-medium mb-4">
          ✦ Nathan Wexel - Mentor de Vendas &amp; IA para personais e nutricionistas - @nathan_wexell
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold uppercase"
          style={{ fontFamily: "Times, Georgia, serif" }}
        >
          Central de{" "}
          <span
            className="italic"
            style={{ backgroundImage: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Material
          </span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
          Todo material que já entreguei em reels e carrossel, num lugar só.
          Escolhe o vídeo e resgata o passo a passo.
        </p>
        <div className="w-20 h-1 mx-auto mt-6 rounded-full" style={{ background: "var(--accent-gradient)" }} />
      </header>

      <div className="max-w-xl mx-auto mb-12">
        <div className="flex rounded-lg overflow-hidden border border-[#333]">
          <input
            type="text"
            placeholder="Comentou uma palavra? Busca ela aqui..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-[var(--bg-card)] text-[var(--text-primary)] px-5 py-3 outline-none placeholder:text-[var(--text-secondary)]"
          />
          <button className="text-white px-6 py-3 font-bold text-sm tracking-wider uppercase transition-opacity hover:opacity-90" style={{ background: "var(--accent-gradient)" }}>
            Buscar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-[var(--text-secondary)] py-20">
          Carregando materiais...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center text-[var(--text-secondary)] py-20">
          Nenhum material encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              onClick={() => setSelected(m)}
            />
          ))}
        </div>
      )}

      {selected && (
        <MaterialModal
          material={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
