'use server'; // Transforma este arquivo em uma Server Action!

import { createServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Função de Ação do Servidor para submeter dados de formulário.
 * Ela é chamada diretamente pelo componente do cliente.
 *
 * @param {string} formName - O nome do formulário (ex: "energia", "contato").
 * @param {object} formData - Os dados do formulário para salvar na coluna JSONB.
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function submitForm(formName, formData) {
  // ✅ CORREÇÃO: agora o cookies() é aguardado antes de ser usado
  const cookieStore = await cookies();
  const supabase = createServer(cookieStore);

  // ✅ Pega o usuário logado (sem quebrar a execução caso não tenha sessão)
  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  // ✅ Insere o registro na tabela
  const { error } = await supabase
    .from('form_submissions')
    .insert([
      {
        form_name: formName,
        data: formData,
      },
    ]);

  if (error) {
    console.error('❌ Erro ao salvar no Supabase:', error.message);
    return { success: false, error: error.message };
  }

  console.log(`✅ Formulário "${formName}" salvo com sucesso!`);
  return { success: true, error: null };
}
