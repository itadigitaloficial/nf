import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { CategoriaServico } from '../types/servico'

export function useCategoriasServico() {
  const queryClient = useQueryClient()

  // Listar categorias de serviço
  const { 
    data: categoriasServico, 
    isLoading,
    error 
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

  // Criar categoria de serviço
  const criarCategoriaServico = useMutation({
    mutationFn: async (data: Pick<CategoriaServico, 'nome' | 'descricao'>) => {
      const { data: categoria, error } = await supabase
        .from('categorias_servico')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return categoria
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias_servico'] })
    }
  })

  // Atualizar categoria de serviço
  const atualizarCategoriaServico = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CategoriaServico> & { id: string }) => {
      const { data: categoria, error } = await supabase
        .from('categorias_servico')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return categoria
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias_servico'] })
    }
  })

  // Deletar categoria de serviço
  const deletarCategoriaServico = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categorias_servico')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias_servico'] })
    }
  })

  return {
    categoriasServico,
    isLoading,
    error,
    criarCategoriaServico,
    atualizarCategoriaServico,
    deletarCategoriaServico
  }
}
