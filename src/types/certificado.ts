export interface CertificadoDigital {
  id: string
  empresaId: string
  nome: string
  valido: boolean
  dataValidade: string
  dataUpload: string
  tipo: 'A1' | 'A3'
  status: 'ATIVO' | 'EXPIRADO' | 'REVOGADO'
}

export interface UploadCertificadoParams {
  empresaId: string
  arquivo: File
  senha: string
  tipo: 'A1' | 'A3'
}

export interface CertificadoResponse {
  id: string
  nome: string
  valido: boolean
  dataValidade: string
  dataUpload: string
  tipo: 'A1' | 'A3'
  status: 'ATIVO' | 'EXPIRADO' | 'REVOGADO'
  diasParaExpirar?: number
}

export interface CertificadoSupabase {
  id: string
  empresa_id: string
  nome: string
  valido: boolean
  data_validade: string
  data_upload: string
  tipo: string
  status: string
  created_at: string
  updated_at: string
}
