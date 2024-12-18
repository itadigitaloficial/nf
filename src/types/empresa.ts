export interface Empresa {
  id?: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoMunicipal: string
  email: string
  telefone: string
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    codigoIbgeUf: number
    codigoIbgeCidade: number
  }
  certificadoDigital?: {
    valido: boolean
    dataValidade: string
  }
}

export interface EmpresaSupabase {
  id: string
  user_id: string
  cnpj: string
  razao_social: string
  nome_fantasia: string
  status_cadastro: 'pendente' | 'ativo' | 'erro'
  webhook_id?: string
  enotas_id?: string // ID da empresa no eNotas
  created_at: string
  updated_at: string
}

export interface VincularCertificadoParams {
  empresaId: string
  arquivo: File
  senha: string
}

export interface EmpresaResponse {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoMunicipal: string
  email: string
  telefone: string
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    codigoIbgeUf: number
    codigoIbgeCidade: number
  }
  certificadoDigital?: {
    valido: boolean
    dataValidade: string
  }
  status_cadastro?: 'pendente' | 'ativo' | 'erro'
  webhook_id?: string
  enotas_id?: string
  created_at: string
  updated_at: string
}
