export interface TipoServico {
  id: string
  nome: string
  descricao?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CategoriaServico {
  id: string
  nome: string
  descricao?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Servico {
  id: string
  nome: string
  tipo_servico_id: string
  categoria_servico_id: string
  prazo_inicio: number // em dias
  prazo_entrega: number // em dias
  valor: number
  descricao?: string
  status: 'ativo' | 'inativo'
  created_at: string
  updated_at: string
  user_id: string
  
  // Relacionamentos
  tipo_servico?: TipoServico
  categoria_servico?: CategoriaServico
}

export interface ServicoInput {
  nome: string
  tipo_servico_id: string
  categoria_servico_id: string
  prazo_inicio: number
  prazo_entrega: number
  valor: number
  descricao?: string
}
