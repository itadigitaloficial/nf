import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { WebhookRequest, WebhookResponse } from "./types.ts";
import { 
  handleEmpresaCadastrada, 
  handleNotaFiscalEmitida, 
  handleNotaFiscalCancelada 
} from "./handlers.ts";

serve(async (req: Request) => {
  try {
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Processar payload
    const payload: WebhookRequest = await req.json();
    console.log('Webhook recebido:', payload);

    let response: WebhookResponse = { success: true };

    // Processar evento
    switch (payload.evento) {
      case 'EmpresaCadastrada':
        await handleEmpresaCadastrada(supabase, payload);
        break;

      case 'NotaFiscalEmitida':
        await handleNotaFiscalEmitida(supabase, payload);
        break;

      case 'NotaFiscalCancelada':
        await handleNotaFiscalCancelada(supabase, payload);
        break;

      default:
        console.warn('Evento não tratado:', payload.evento);
        response = { 
          success: false, 
          error: `Evento não suportado: ${payload.evento}` 
        };
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { "Content-Type": "application/json" },
        status: response.success ? 200 : 400
      }
    );

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    const response: WebhookResponse = {
      success: false,
      error: error.message
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
