import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseAdmin() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Material = {
  id: string;
  titulo: string;
  descricao: string;
  conteudo_completo: string;
  imagem_capa: string | null;
  ordem: number;
  ativo: boolean;
  status: "rascunho" | "publicado" | "oculto";
  created_at: string;
  updated_at: string;
};
