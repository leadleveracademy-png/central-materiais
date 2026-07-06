"use client";

import { useState } from "react";
import { supabase, Material } from "@/lib/supabase";

export default function AdminForm({
  material,
  onSave,
  onCancel,
}: {
  material: Material | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [titulo, setTitulo] = useState(material?.titulo || "");
  const [descricao, setDescricao] = useState(material?.descricao || "");
  const [conteudo, setConteudo] = useState(material?.conteudo_completo || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(material?.imagem_capa || "");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSave(status: "rascunho" | "publicado") {
    setSaving(true);

    let imagemCapa = material?.imagem_capa || null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("capas-materiais")
        .upload(fileName, imageFile, { upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("capas-materiais")
          .getPublicUrl(fileName);
        imagemCapa = urlData.publicUrl;
      }
    }

    const payload = {
      titulo,
      descricao,
      conteudo_completo: conteudo,
      imagem_capa: imagemCapa,
      status,
      ativo: status === "publicado",
      updated_at: new Date().toISOString(),
    };

    if (material) {
      await supabase
        .from("central_materiais")
        .update(payload)
        .eq("id", material.id);
    } else {
      await supabase.from("central_materiais").insert(payload);
    }

    setSaving(false);
    onSave();
  }

  return (
    <div
      className="bg-[var(--bg-card)] rounded-xl p-6 mb-8 border border-[#333]"
    >
      <h2 className="text-xl font-bold mb-6">
        {material ? "Editar Material" : "Novo Material"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">
            Título / Gancho do conteúdo
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Como triplicar seus leads com IA"
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">
            Descrição curta (aparece no card)
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Uma frase resumindo o material..."
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">
            Imagem de capa (JPEG)
          </label>
          <div className="flex items-center gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--accent)] file:text-white file:font-medium file:cursor-pointer hover:file:bg-[var(--accent-light)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-1">
            Conteúdo completo (Markdown — aparece no pop-up)
          </label>
          <p className="text-xs text-[var(--text-secondary)] mb-2 opacity-60">
            Use **negrito**, *itálico*, # títulos, - listas, [texto](link),
            {" > "}citações, `código`
          </p>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder={`# Título do material\n\nDescrição do que o lead vai aprender...\n\n## Passo 1\n\nExplicação detalhada...\n\n## Passo 2\n\n- Item 1\n- Item 2\n\n> Dica importante aqui`}
            rows={16}
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)] text-[var(--text-primary)] font-mono text-sm resize-y"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          disabled={saving || !titulo || !descricao || !conteudo}
          onClick={() => handleSave("rascunho")}
          className="bg-yellow-900/50 hover:bg-yellow-800/50 disabled:opacity-50 text-yellow-400 px-6 py-3 rounded-lg font-bold transition-colors"
        >
          {saving ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          type="button"
          disabled={saving || !titulo || !descricao || !conteudo}
          onClick={() => handleSave("publicado")}
          className="bg-[var(--accent)] hover:bg-[var(--accent-light)] disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          {saving ? "Salvando..." : "Publicar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-[var(--bg-dark)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] px-6 py-3 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
