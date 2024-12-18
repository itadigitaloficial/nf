import axios from 'axios'

const enotasApi = axios.create({
  baseURL: 'https://api.enotasgw.com.br/v1',
  headers: {
    'Authorization': `Basic ${import.meta.env.VITE_ENOTAS_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const enotasService = {
  // Empresas
  cadastrarEmpresa: async (data: any) => {
    return enotasApi.post('/empresas', data)
  },
  listarEmpresas: async () => {
    return enotasApi.get('/empresas')
  },
  vincularCertificado: async (empresaId: string, data: any) => {
    return enotasApi.post(`/empresas/${empresaId}/certificadoDigital`, data)
  },
  configurarWebhook: async (empresaId: string) => {
    return enotasApi.post(`/empresas/${empresaId}/webhook`, {
      url: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/webhook-enotas`,
      eventos: [
        'EmpresaCadastrada',
        'NotaFiscalEmitida',
        'NotaFiscalCancelada'
      ]
    })
  },

  // Serviços
  buscarServicosMunicipais: async (uf: string, cidade: string) => {
    return enotasApi.get(`/estados/${uf}/cidades/${cidade}/servicos`)
  },

  // Notas Fiscais
  emitirNota: async (empresaId: string, data: any) => {
    return enotasApi.post(`/empresas/${empresaId}/nfes`, data)
  },
  listarNotas: async (empresaId: string) => {
    return enotasApi.get(`/empresas/${empresaId}/nfes`)
  }
}

// Tipos
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

export interface NotaFiscal {
  tipo: 'NFS-e'
  valorTotal: number
  servico: {
    descricao: string
    codigoServico: string
  }
  tomador: {
    razaoSocial: string
    email: string
    cpfCnpj: string
  }
}

export interface ServicoMunicipal {
  codigo: string
  descricao: string
  aliquota: number
}

export interface WebhookResponse {
  id: string
  url: string
  eventos: string[]
}
