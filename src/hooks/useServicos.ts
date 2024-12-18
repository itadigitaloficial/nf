import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Servico, ServicoInput, TipoServico, CategoriaServico } from '../types/servico'

export function useServicos() {
  const queryClient = useQueryClient()

  // Listar serviços
  const { 
    data: servicos, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['servicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          tipo_servico:tipos_servico(*),
          categoria_servico:categorias_servico(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Servico[]
    }
  })

  // Criar serviço
  const criarServico = useMutation({
    mutationFn: async (data: ServicoInput) => {
      const { data: servico, error } = await supabase
        .from('servicos')
        .insert([{ ...data, status: 'ativo' }])
        .select()
        .single()

      if (error) throw error
      return servico
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
    }
  })

  // Atualizar serviço
  const atualizarServico = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Servico> & { id: string }) => {
      const { data: servico, error } = await supabase
        .from('servicos')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return servico
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
    }
  })

  // Deletar serviço
  const deletarServico = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] })
    }
  })

  // Listar tipos de serviço
  const { 
    data: tiposServico,
    isLoading: loadingTipos 
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

  // Listar categorias de serviço
  const { 
    data: categoriasServico,
    isLoading: loadingCategorias 
  } = useQuery({
    queryKey: ['categorias_servico'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias_servico')
        .select('*')
        .order('nome')

      if (error) throw error
      return data as CategoriaServico[]
    }
  })

  return {
    servicos,
    isLoading,
    error,
    criarServico,
    atualizarServico,
    deletarServico,
    tiposServico,
    loadingTipos,
    categoriasServico,
    loadingCategorias
  }
}
