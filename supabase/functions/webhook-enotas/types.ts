import { SupabaseClient as BaseSupabaseClient } from '@supabase/supabase-js';

export interface WebhookResponse {
  success: boolean;
  error?: string;
}

export interface EmpresaPayload {
  id: string;
  cnpj: string;
  status: string;
}

export interface NotaFiscalPayload {
  id: string;
  numero: string;
  status: string;
  dataEmissao: string;
}

export interface WebhookData {
  empresa?: EmpresaPayload;
  notaFiscal?: NotaFiscalPayload;
}

export interface WebhookRequest {
  evento: 'EmpresaCadastrada' | 'NotaFiscalEmitida' | 'NotaFiscalCancelada';
  id: string;
  data: WebhookData;
}

export interface DatabaseResponse {
  data: any;
  error: any;
}

// Extendendo o tipo base do SupabaseClient
export type SupabaseClient = BaseSupabaseClient;

export const STATUS = {
  PENDENTE: 'pendente',
  ATIVO: 'ativo',
  ERRO: 'erro'
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];

// Tipos para as tabelas do Supabase
export interface Tables {
  empresas: {
    id: string;
    user_id: string;
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    status_cadastro: Status;
    webhook_id?: string;
    enotas_id?: string;
    created_at: string;
    updated_at: string;
  };
  notas_fiscais: {
    id: string;
    empresa_id: string;
    numero: string;
    status_emissao: string;
    data_emissao: string;
    created_at: string;
    updated_at: string;
  };
}
