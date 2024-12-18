import { useMutation, useQuery } from '@tanstack/react-query'
import { enotasService } from '../lib/enotas'
import { supabase } from '../lib/supabase'
import { CertificadoSupabase, UploadCertificadoParams } from '../types/certificado'
import { useEmpresas } from './useEmpresas'

export function useCertificados() {
  const { empresa } = useEmpresas()

  // Buscar certificados da empresa
  const { 
    data: certificados, 
    isLoading,
    error,
    refetch: recarregarCertificados
  } = useQuery({
    queryKey: ['certificados', empresa?.id],
    queryFn: async () => {
      if (!empresa) return []

      // Buscar certificados no Supabase
      const { data: certificadosData } = await supabase
        .from('certificados')
        .select('*')
        .eq('empresa_id', empresa.id)
        .order('created_at', { ascending: false })

      if (!certificadosData) return []

      // Calcular dias para expirar
      return certificadosData.map((cert: CertificadoSupabase) => {
        const dataValidade = new Date(cert.data_validade)
        const hoje = new Date()
        const diasParaExpirar = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24))

        return {
          id: cert.id,
          empresaId: cert.empresa_id,
          nome: cert.nome,
          valido: cert.valido,
          dataValidade: cert.data_validade,
          dataUpload: cert.data_upload,
          tipo: cert.tipo as 'A1' | 'A3',
          status: cert.status as 'ATIVO' | 'EXPIRADO' | 'REVOGADO',
          diasParaExpirar
        }
      })
    },
    enabled: !!empresa
  })

  // Upload de novo certificado
  const uploadCertificado = useMutation({
    mutationFn: async ({ empresaId, arquivo, senha, tipo }: UploadCertificadoParams) => {
      // Upload no eNotas
      const formData = new FormData()
      formData.append('arquivo', arquivo)
      formData.append('senha', senha)
      formData.append('tipo', tipo)

      const { data: enotasCertificado } = await enotasService.vincularCertificado(empresaId, formData)

      // Salvar no Supabase
      const certificadoSupabase: Partial<CertificadoSupabase> = {
        empresa_id: empresaId,
        nome: arquivo.name,
        valido: true,
        data_validade: enotasCertificado.dataValidade,
        data_upload: new Date().toISOString(),
        tipo,
        status: 'ATIVO'
      }

      await supabase.from('certificados').insert(certificadoSupabase)

      // Recarregar lista
      await recarregarCertificados()

      return enotasCertificado
    }
  })

  // Revogar certificado
  const revogarCertificado = useMutation({
    mutationFn: async (certificadoId: string) => {
      // Atualizar status no Supabase
      await supabase
        .from('certificados')
        .update({ 
          valido: false,
          status: 'REVOGADO'
        })
        .eq('id', certificadoId)

      // Recarregar lista
      await recarregarCertificados()
    }
  })

  return {
    certificados,
    isLoading,
    error,
    uploadCertificado,
    revogarCertificado,
    recarregarCertificados
  }
}
