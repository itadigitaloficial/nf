import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Tomador, TomadorSupabase } from '../types/tomador'

export function useTomadores() {
  // Buscar tomadores do usuário
  const { data: tomadores, isLoading, error, refetch: recarregarTomadores } = useQuery({
    queryKey: ['tomadores'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: tomadoresData } = await supabase
        .from('tomadores')
        .select('*')
        .eq('user_id', user.id)

      return tomadoresData as TomadorSupabase[]
    }
  })

  // Adicionar novo tomador
  const adicionarTomador = useMutation({
    mutationFn: async (tomador: Tomador) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const tomadorSupabase: Partial<TomadorSupabase> = {
        user_id: user.id,
        razao_social: tomador.razaoSocial,
        cpf_cnpj: tomador.cpfCnpj,
        email: tomador.email,
        telefone: tomador.telefone,
        cep: tomador.endereco.cep,
        logradouro: tomador.endereco.logradouro,
        numero: tomador.endereco.numero,
        complemento: tomador.endereco.complemento || '',
        bairro: tomador.endereco.bairro,
        cidade: tomador.endereco.cidade,
        uf: tomador.endereco.uf
      }

      await supabase.from('tomadores').insert(tomadorSupabase)
      await recarregarTomadores()
    }
  })

  // Remover tomador
  const removerTomador = useMutation({
    mutationFn: async (tomadorId: string) => {
      await supabase.from('tomadores').delete().eq('id', tomadorId)
      await recarregarTomadores()
    }
  })

  return {
    tomadores,
    isLoading,
    error,
    adicionarTomador,
    removerTomador,
    recarregarTomadores
  }
}
