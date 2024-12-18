export interface NotaFiscal {
  id: string
  numero: string
  dataEmissao: string
  valorTotal: number
  status: string
  tomador: {
    razaoSocial: string
    email: string
    cpfCnpj: string
  }
}

export interface NotaFiscalInput {
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
