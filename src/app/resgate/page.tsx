// Funil de resgate.
//
// O formulário (nome, WhatsApp, o que faz, faturamento, maior dor) e a tela de
// "Tá Liberado" com o link do grupo agora vivem no LeverForms e entram aqui por
// iframe — assim as respostas caem no painel do LeverForms em vez de numa tabela
// solta. O `?embed=1` avisa o LeverForms que ele está embarcado: qualquer redirect
// final estoura pra janela do topo em vez de abrir dentro da caixinha.
//
// O webhook do CLINT continua sendo disparado — só que agora pelo próprio
// LeverForms (integração "n8n → CLINT (resgate posts)" no formulário), e não mais
// por este arquivo. O nó "Edit Fields" do n8n aceita os dois formatos de payload.
//
// Form no LeverForms: https://forms.leadlever.com.br/f/resgate-material

const FORM_EMBED_URL =
  "https://forms.leadlever.com.br/f/resgate-material?embed=1&utm_source=lp-nathanwexell-bio&utm_medium=resgate";

export default function ResgatePage() {
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
            style={{
              backgroundImage: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Material
          </span>{" "}
          dos posts
        </h1>
        <div className="w-20 h-1 mt-6 rounded-full" style={{ background: "var(--accent-gradient)" }} />

        <p className="text-[var(--text-secondary)] mt-6 max-w-xl">
          Chegou pela bio? Aqui é onde eu libero todo o material prático que apareço usando
          nos reels e carrosseis: guias, prompts e setups de IA e Claude. Preenche aí embaixo
          que eu te passo o acesso — e na descrição do grupo tá a Central de Material com
          tudo, pronto pra resgatar. Leva 15 segundos.
        </p>
      </header>

      <iframe
        src={FORM_EMBED_URL}
        title="Resgate o Material dos posts"
        className="w-full h-[720px] md:h-[680px] rounded-xl border border-[#2a2a2a]"
        allow="clipboard-write"
      />

      <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
        Sem spam. Só conteúdo prático sobre IA e Claude Code.
      </p>
    </main>
  );
}
