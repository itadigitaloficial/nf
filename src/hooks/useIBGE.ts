import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Estado {
  id: number
  sigla: string
  nome: string
}

interface Cidade {
  id: number
  nome: string
}

export function useIBGE() {
  const { data: estados } = useQuery({
    queryKey: ['estados'],
    queryFn: async () => {
      const response = await axios.get<Estado[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      return response.data.sort((a, b) => a.nome.localeCompare(b.nome))
    }
  })

  const getCidades = (uf: string) => {
    return useQuery({
      queryKey: ['cidades', uf],
      queryFn: async () => {
        if (!uf) return []
        const estado = estados?.find(estado => estado.sigla === uf)
        if (!estado) return []
        
        const response = await axios.get<Cidade[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
        )
        return response.data.sort((a, b) => a.nome.localeCompare(b.nome))
      },
      enabled: !!uf && !!estados
    })
  }

  return {
    estados,
    getCidades
  }
}
