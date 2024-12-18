import { SupabaseClient, WebhookRequest, DatabaseResponse } from "./types.ts";

export async function handleEmpresaCadastrada(
  supabase: SupabaseClient,
  payload: WebhookRequest
): Promise<DatabaseResponse> {
  if (!payload.data.empresa) {
    throw new Error('Dados da empresa não encontrados no payload');
  }

  const { empresa } = payload.data;

  return await supabase
    .from('empresas')
    .update({ 
      status_cadastro: empresa.status === 'ativo' ? 'ativo' : 'erro',
      webhook_id: payload.id,
      enotas_id: empresa.id // Salvando o ID da empresa no eNotas
    })
    .eq('cnpj', empresa.cnpj);
}

export async function handleNotaFiscalEmitida(
  supabase: SupabaseClient,
  payload: WebhookRequest
): Promise<DatabaseResponse> {
  if (!payload.data.notaFiscal) {
    throw new Error('Dados da nota fiscal não encontrados no payload');
  }

  const { notaFiscal } = payload.data;

  return await supabase
    .from('notas_fiscais')
    .update({ 
      status_emissao: 'emitida',
      numero: notaFiscal.numero,
      data_emissao: notaFiscal.dataEmissao
    })
    .eq('id', notaFiscal.id);
}

export async function handleNotaFiscalCancelada(
  supabase: SupabaseClient,
  payload: WebhookRequest
): Promise<DatabaseResponse> {
  if (!payload.data.notaFiscal) {
    throw new Error('Dados da nota fiscal não encontrados no payload');
  }

  const { notaFiscal } = payload.data;

  return await supabase
    .from('notas_fiscais')
    .update({ 
      status_emissao: 'cancelada'
    })
    .eq('id', notaFiscal.id);
}

// Função auxiliar para log
export function logWebhookEvent(evento: string, dados: any) {
  console.log(`[${new Date().toISOString()}] Evento ${evento} recebido:`, dados);
}
