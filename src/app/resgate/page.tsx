"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const LINK_GRUPO_WHATSAPP = "#LINK-DO-GRUPO";

const OPCOES_FAZ = ["Personal trainer", "Nutricionista", "Criador de conteúdo", "Outro"];
const OPCOES_FATURA = ["Ainda não faturo", "Até R$5 mil", "R$5 mil a R$20 mil", "R$20 mil ou mais"];
const OPCOES_DOR = [
  "Não sei o que postar",
  "Não converto os leads que chegam",
  "Perco tempo com tarefa repetitiva",
  "Já uso IA, quero escalar",
];

export default function ResgatePage() {
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [oQueFaz, setOQueFaz] = useState("");
  const [faturamento, setFaturamento] = useState("");
  const [maiorDor, setMaiorDor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function finalizar(dorSelecionada: string) {
    setEnviando(true);
    setErro("");
    const { error } = await supabase.from("leads_funil_resgate").insert({
      nome,
      whatsapp,
      o_que_faz: oQueFaz,
      faturamento,
      maior_dor: dorSelecionada,
    });
    setEnviando(false);
    if (error) {
      setErro("Não deu pra salvar seus dados agora. Tenta de novo em instantes.");
      return;
    }
    setStep(4);
  }

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !whatsapp) return;
    setStep(1);
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <header className="mb-10">
        <p className="text-[var(--accent)] text-xs tracking-[0.15em] font-medium mb-4">
          ✦ Nathan Wexel - Mentor de Vendas &amp; IA para personais e nutricionistas - @nathan_wexell
        </p>
        <h1
          className="text-4xl md:text-6xl font-bold uppercase"
          style={{ fontFamily: "Times, Georgia, serif" }}
        >
          Resgate o{" "}
          <span
            className="italic"
            style={{ backgroundImage: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Material
          </span>{" "}
          dos posts
        </h1>
        <div className="w-20 h-1 mt-6 rounded-full" style={{ background: "var(--accent-gradient)" }} />

        {step < 4 && (
          <p className="text-[var(--text-secondary)] mt-6 max-w-xl">
            Chegou pela bio? Aqui é onde eu libero todo o material prático que apareço usando
            nos reels e carrosseis: guias, prompts e setups de IA e Claude. Preenche aí embaixo
            que eu te passo o acesso — e na descrição do grupo tá a Central de Material com
            tudo, pronto pra resgatar. Leva 15 segundos.
          </p>
        )}
      </header>

      {step === 0 && (
        <form
          onSubmit={handleStep1Submit}
          className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 border border-[#2a2a2a]"
        >
          <h2
            className="text-2xl italic mb-1"
            style={{ fontFamily: "Times, Georgia, serif" }}
          >
            Preenche pra resgatar o material
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Leva 10 segundos. É de graça.
          </p>

          <label className="block text-sm font-medium mb-1">Seu nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como te chamam"
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 mb-5 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />

          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(41) 99999-9999"
            className="w-full bg-[var(--bg-dark)] border border-[#333] rounded-lg px-4 py-3 outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
            required
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1 mb-6">
            De fora do Brasil? Digita com + e o código do país (ex: +598 99 123 456)
          </p>

          <button
            type="submit"
            className="w-full text-white py-4 rounded-lg font-bold tracking-wide transition-opacity hover:opacity-90"
            style={{ background: "var(--accent-gradient)" }}
          >
            RESGATAR O MATERIAL →
          </button>
          <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
            Sem spam. Só conteúdo prático sobre IA e Claude Code.
          </p>
        </form>
      )}

      {(step === 1 || step === 2 || step === 3) && (
        <div className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-1">
            <h2
              className="text-2xl italic"
              style={{ fontFamily: "Times, Georgia, serif" }}
            >
              Último passo
            </h2>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="w-6 h-1 rounded-full"
                  style={{
                    background: n <= step ? "var(--accent-gradient)" : "#333",
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            {3 - step + 1 === 1 ? "1 toque" : `${3 - step + 1} toques`} e o material é seu.
          </p>

          {step === 1 && (
            <>
              <p className="font-medium mb-3">O que você faz?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPCOES_FAZ.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => {
                      setOQueFaz(opcao);
                      setStep(2);
                    }}
                    className="text-left bg-[var(--bg-dark)] border border-[#333] hover:border-[var(--accent)] rounded-lg px-4 py-3 transition-colors"
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="font-medium mb-3">Quanto você fatura por mês?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPCOES_FATURA.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => {
                      setFaturamento(opcao);
                      setStep(3);
                    }}
                    className="text-left bg-[var(--bg-dark)] border border-[#333] hover:border-[var(--accent)] rounded-lg px-4 py-3 transition-colors"
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="font-medium mb-3">Qual sua maior dor hoje na consultoria?</p>
              <div className="flex flex-col gap-3">
                {OPCOES_DOR.map((opcao) => (
                  <button
                    key={opcao}
                    disabled={enviando}
                    onClick={() => {
                      setMaiorDor(opcao);
                      finalizar(opcao);
                    }}
                    className="text-left bg-[var(--bg-dark)] border border-[#333] hover:border-[var(--accent)] rounded-lg px-4 py-3 transition-colors disabled:opacity-50"
                  >
                    {opcao}
                  </button>
                ))}
              </div>
              {enviando && (
                <p className="text-sm text-[var(--text-secondary)] mt-4">Salvando...</p>
              )}
              {erro && <p className="text-sm text-red-400 mt-4">{erro}</p>}
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl font-bold mb-6"
            style={{ background: "var(--accent-gradient)" }}
          >
            ✓
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold uppercase mb-4"
            style={{ fontFamily: "Times, Georgia, serif" }}
          >
            Tá{" "}
            <span
              className="italic"
              style={{ backgroundImage: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Liberado
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-10">
            O material não vem mais por aqui — agora tá tudo num lugar só. Faz esses 2 passos
            que leva 1 minuto.
          </p>

          <div className="space-y-4 text-left">
            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  1
                </span>
                <h3 className="text-lg italic" style={{ fontFamily: "Times, Georgia, serif" }}>
                  Entra no grupo grátis do WhatsApp
                </h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                É de graça, sem spam. Conteúdo prático de IA e Claude Code direto no seu zap.
              </p>
              <a
                href={LINK_GRUPO_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-colors"
              >
                ENTRAR NO GRUPO →
              </a>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  2
                </span>
                <h3 className="text-lg italic" style={{ fontFamily: "Times, Georgia, serif" }}>
                  Pega o material na Central
                </h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Na descrição do grupo tem o link da Central de Material — o passo a passo deste
                reel e de todos os outros, num lugar só. É só escolher e resgatar.
              </p>
              <Link
                href="/"
                className="block text-center text-white font-bold py-3 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--accent-gradient)" }}
              >
                IR PRA CENTRAL DE MATERIAL →
              </Link>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-10">
            Nathan Wexel · IA + Claude Code na prática · @nathan_wexell
          </p>
        </div>
      )}
    </main>
  );
}
