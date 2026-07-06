"use client";

import { useEffect, useState } from "react";
import { supabase, Material } from "@/lib/supabase";
import AdminForm from "@/components/AdminForm";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [editing, setEditing] = useState<Material | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      setChecking(false);
      if (session) loadMateriais();
    });
  }, []);

  async function loadMateriais() {
    const { data } = await supabase
      .from("central_materiais")
      .select("*")
      .order("created_at", { ascending: false });
    setMateriais(data || []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginError("Email ou senha inválidos.");
      return;
    }
    setLoggedIn(true);
    loadMateriais();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este material?")) return;
    await supabase.from("central_materiais").delete().eq("id", id);
    loadMateriais();
  }

  async function handleChangeStatus(id: string, status: string) {
    const nextStatus =
      status === "publicado" ? "oculto" :
      status === "oculto" ? "rascunho" :
      "publicado";
    await supabase
      .from("central_materiais")
      .update({ status: nextStatus, ativo: nextStatus === "publicado" })
      .eq("id", id);
    loadMateriais();
  }

  async function handlePublish(id: string) {
    await supabase
      .from("central_materiais")
      .update({ status: "publicado", ativo: true })
      .eq("id", id);
    loadMateriais();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Verificando sessão...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-[var(--bg-card)] rounded-xl p-8"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Painel Admin</h1>
          {loginError && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {loginError}
            </p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 mb-3 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 mb-5 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white py-3 rounded-lg font-bold transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            + Novo Material
          </button>
          <button
            onClick={handleLogout}
            className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {showForm && (
        <AdminForm
          material={editing}
          onSave={() => {
            setShowForm(false);
            setEditing(null);
            loadMateriais();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="space-y-3">
        {materiais.map((m) => (
          <div
            key={m.id}
            className="bg-[var(--bg-card)] rounded-lg p-4 flex items-center gap-4"
          >
            {m.imagem_capa && (
              <img
                src={m.imagem_capa}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{m.titulo}</h3>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                {m.descricao}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
                  m.status === "publicado"
                    ? "bg-green-900/50 text-green-400"
                    : m.status === "rascunho"
                    ? "bg-yellow-900/50 text-yellow-400"
                    : "bg-red-900/50 text-red-400"
                }`}
              >
                {m.status === "publicado" ? "Publicado" : m.status === "rascunho" ? "Rascunho" : "Oculto"}
              </span>
              {m.status === "rascunho" && (
                <button
                  onClick={() => handlePublish(m.id)}
                  className="bg-green-900/50 hover:bg-green-800/50 text-green-400 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Publicar
                </button>
              )}
              {m.status === "publicado" && (
                <button
                  onClick={() => handleChangeStatus(m.id, m.status)}
                  className="bg-[var(--bg-dark)] hover:bg-red-900/50 text-[var(--text-secondary)] hover:text-red-400 px-3 py-1 rounded text-xs transition-colors"
                >
                  Ocultar
                </button>
              )}
              {m.status === "oculto" && (
                <button
                  onClick={() => handlePublish(m.id)}
                  className="bg-green-900/50 hover:bg-green-800/50 text-green-400 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Publicar
                </button>
              )}
              <button
                onClick={() => {
                  setEditing(m);
                  setShowForm(true);
                }}
                className="bg-[var(--bg-dark)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] px-3 py-1 rounded text-xs transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="bg-[var(--bg-dark)] hover:bg-red-900/50 text-[var(--text-secondary)] hover:text-red-400 px-3 py-1 rounded text-xs transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {materiais.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-12">
            Nenhum material cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
