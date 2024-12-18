import { WebhookRequest, DatabaseResponse, SupabaseClient } from "./types.ts";

// Interface para o logger
export interface Logger {
  info: (message: string, data?: any) => void;
  error: (message: string, error?: any) => void;
  warn: (message: string, data?: any) => void;
}

// Implementação do logger
export const logger: Logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  }
};

// Configuração do retry
export const RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 1000, // 1 segundo entre tentativas
};

// Função para retry com delay exponencial
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = RETRY_CONFIG.maxAttempts,
  baseDelay: number = RETRY_CONFIG.delayMs
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;

      // Delay exponencial: 1s, 2s, 4s, etc.
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Tentativa ${attempt} falhou. Tentando novamente em ${delay}ms`, { error });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Função para validar payload do webhook
export function validateWebhookPayload(payload: any): payload is WebhookRequest {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload inválido');
  }

  if (!payload.evento || !payload.id || !payload.data) {
    throw new Error('Payload não contém campos obrigatórios');
  }

  const validEvents = ['EmpresaCadastrada', 'NotaFiscalEmitida', 'NotaFiscalCancelada'];
  if (!validEvents.includes(payload.evento)) {
    throw new Error(`Evento inválido: ${payload.evento}`);
  }

  return true;
}

// Função para notificar usuário sobre mudanças de status
export async function notifyStatusChange(
  supabase: SupabaseClient,
  userId: string,
  message: string
): Promise<DatabaseResponse> {
  return await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      message,
      type: 'status_change',
      read: false,
      created_at: new Date().toISOString()
    });
}

// Função para salvar log de eventos no banco
export async function saveEventLog(
  supabase: SupabaseClient,
  event: string,
  status: 'success' | 'error',
  details: any
): Promise<DatabaseResponse> {
  return await supabase
    .from('webhook_logs')
    .insert({
      event,
      status,
      details,
      created_at: new Date().toISOString()
    });
}
