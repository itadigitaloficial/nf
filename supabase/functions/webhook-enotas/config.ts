export const WEBHOOK_EVENTS = {
  EMPRESA_CADASTRADA: 'EmpresaCadastrada',
  NOTA_FISCAL_EMITIDA: 'NotaFiscalEmitida',
  NOTA_FISCAL_CANCELADA: 'NotaFiscalCancelada'
} as const

export const STATUS = {
  PENDENTE: 'pendente',
  ATIVO: 'ativo',
  ERRO: 'erro'
} as const

export type WebhookEvent = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS]
export type Status = typeof STATUS[keyof typeof STATUS]

export interface WebhookPayload {
  evento: WebhookEvent
  id: string
  data: {
    empresa?: {
      id: string
      cnpj: string
      status: string
    }
    notaFiscal?: {
      id: string
      numero: string
      status: string
      dataEmissao: string
    }
  }
}
