import { useMutation, useQuery } from '@tanstack/react-query'
import { enotasService, NotaFiscal } from '../lib/enotas'
import { useEmpresas } from './useEmpresas'

export function useNotas() {
  const { empresa } = useEmpresas()

  // Listar notas fiscais
  const { 
    data: notas, 
    isLoading, 
    error,
    refetch: recarregarNotas
  } = useQuery({
    queryKey: ['notas', empresa?.id],
    queryFn: async () => {
      if (!empresa?.id) return []
      const { data } = await enotasService.listarNotas(empresa.id)
      return data
    },
    enabled: !!empresa?.id // Só executa se tiver uma empresa
  })

  // Emitir nova nota fiscal
  const emitirNota = useMutation({
    mutationFn: async (data: NotaFiscal) => {
      if (!empresa?.id) throw new Error('Empresa não encontrada')
      const response = await enotasService.emitirNota(empresa.id, data)
      // Recarrega a lista de notas após emitir uma nova
      await recarregarNotas()
      return response.data
    }
  })

  // Buscar serviços municipais
  const buscarServicos = useMutation({
    mutationFn: async ({ uf, cidade }: { uf: string, cidade: string }) => {
      const { data } = await enotasService.buscarServicosMunicipais(uf, cidade)
      return data
    }
  })

  return {
    notas,
    isLoading,
    error,
    emitirNota,
    buscarServicos,
    recarregarNotas
  }
}
