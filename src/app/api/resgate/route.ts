import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy do funil de resgate → LeverForms.
 *
 * A página /resgate posta aqui (mesma origem), e este handler repassa
 * servidor-a-servidor pro endpoint público de submit do LeverForms — sem CORS.
 * O LeverForms grava a resposta (painel de Leads, score, UTM) e dispara o
 * webhook do CLINT (integração "n8n → CLINT (resgate posts)" configurada lá).
 *
 * Form no LeverForms: "Resgate o Material dos posts" (interno: RESGATE → Grupo WhatsApp)
 * https://forms.leadlever.com.br/f/resgate-materiais
 */

const FORM_ID = "a246e5d3-e57d-4ce4-a01c-88a01020134b";
const SUBMIT_URL = `https://forms.leadlever.com.br/api/forms/${FORM_ID}/submit`;

// IDs dos campos no LeverForms — precisam bater com o form publicado lá.
const FIELD = {
  nome: "a713b90a-29c8-4142-8c9a-0c06441add70",
  whatsapp: "44054620-88f0-4e3b-803b-4216f5a52af2",
  o_que_faz: "bd5103da-b48a-404e-b15b-41dc384a373d",
  faturamento: "e94e3bd8-154d-4cfa-8835-0f2c6ea676e7",
  maior_dor: "ccb71bf0-8ea1-4f36-a111-c5c2f06f40a4",
} as const;

// Mesmos scores das opções do form no LeverForms (máx 30+40+30 = 100, passing 70).
const SCORE_FAZ: Record<string, number> = {
  "Personal trainer": 30,
  "Nutricionista": 30,
  "Criador de conteúdo": 20,
  "Outro": 10,
};
const SCORE_FATURA: Record<string, number> = {
  "Ainda não faturo": 0,
  "Até R$5 mil": 15,
  "R$5 mil a R$20 mil": 30,
  "R$20 mil ou mais": 40,
};
const SCORE_DOR: Record<string, number> = {
  "Não sei o que postar": 20,
  "Não converto os leads que chegam": 25,
  "Perco tempo com tarefa repetitiva": 25,
  "Já uso IA, quero escalar": 30,
};

export async function POST(request: NextRequest) {
  let body: {
    nome?: string;
    whatsapp?: string;
    o_que_faz?: string;
    faturamento?: string;
    maior_dor?: string;
    utm?: Record<string, string>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { nome, whatsapp, o_que_faz, faturamento, maior_dor } = body;
  if (!nome || !whatsapp || !o_que_faz || !faturamento || !maior_dor) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const score =
    (SCORE_FAZ[o_que_faz] ?? 0) +
    (SCORE_FATURA[faturamento] ?? 0) +
    (SCORE_DOR[maior_dor] ?? 0);

  // Só chaves utm_* passam adiante
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.utm ?? {})) {
    if (k.startsWith("utm_") && typeof v === "string") utm[k] = v.slice(0, 200);
  }

  const answers = {
    [FIELD.nome]: nome,
    [FIELD.whatsapp]: whatsapp,
    [FIELD.o_que_faz]: o_que_faz,
    [FIELD.faturamento]: faturamento,
    [FIELD.maior_dor]: maior_dor,
  };

  try {
    const res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // repassa o IP real do visitante pro LeverForms registrar
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify({ answers, partial: false, score, utm }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("LeverForms submit falhou:", res.status, detail.slice(0, 300));
      return NextResponse.json({ error: "Falha ao salvar" }, { status: 502 });
    }
    const data = (await res.json()) as { id?: string };
    return NextResponse.json({ ok: true, id: data.id ?? null });
  } catch (err) {
    console.error("LeverForms submit erro de rede:", err);
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 502 });
  }
}
