import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { TipoServico } from '../types/servico'

export function useTiposServico() {
  const queryClient = useQueryClient()

  // Listar tipos de serviço
  const { 
    data: tiposServico, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['tipos_servico'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_servico')
        .select('*')
        .order('nome')

      if (error) throw error
      return data as TipoServico[]
    }
  })

  // Criar tipo de serviço
  const criarTipoServico = useMutation({
    mutationFn: async (data: Pick<TipoServico, 'nome' | 'descricao'>) => {
      const { data: tipo, error } = await supabase
        .from('tipos_servico')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return tipo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos_servico'] })
    }
  })

  // Atualizar tipo de serviço
  const atualizarTipoServico = useMutation({
    mutationFn: async ({ id, ...data }: Partial<TipoServico> & { id: string }) => {
      const { data: tipo, error } = await supabase
        .from('tipos_servico')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return tipo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos_servico'] })
    }
  })

  // Deletar tipo de serviço
  const deletarTipoServico = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tipos_servico')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos_servico'] })
    }
  })

  return {
    tiposServico,
    isLoading,
    error,
    criarTipoServico,
    atualizarTipoServico,
    deletarTipoServico
  }
}
