import { useMutation, useQuery } from '@tanstack/react-query'
import { enotasService } from '../lib/enotas'
import { supabase } from '../lib/supabase'
import { Empresa, EmpresaSupabase, VincularCertificadoParams } from '../types/empresa'

export function useEmpresas() {
  // Buscar empresa do usuário logado
  const { 
    data: empresa, 
    isLoading, 
    error,
    refetch: recarregarEmpresa 
  } = useQuery({
    queryKey: ['empresa'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar empresa vinculada ao usuário no Supabase
      const { data: empresaData } = await supabase
        .from('empresas')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!empresaData) return null

      // Buscar detalhes da empresa no eNotas
      const { data: enotasEmpresa } = await enotasService.listarEmpresas()
      const empresa = enotasEmpresa.find((emp: Empresa) => emp.cnpj === empresaData.cnpj)

      // Combinar dados do Supabase com eNotas
      return {
        ...empresa,
        status_cadastro: empresaData.status_cadastro,
        webhook_id: empresaData.webhook_id,
        enotas_id: empresaData.enotas_id // Incluindo o enotas_id nos dados retornados
      }
    }
  })

  // Cadastrar nova empresa
  const cadastrarEmpresa = useMutation({
    mutationFn: async (data: Empresa) => {
      try {
        // Formatar dados para a API do eNotas
        const enotasData = {
          id: data.id,
          cnpj: data.cnpj,
          razaoSocial: data.razaoSocial,
          nomeFantasia: data.nomeFantasia,
          inscricaoMunicipal: data.inscricaoMunicipal,
          email: data.email,
          telefone: data.telefone,
          endereco: {
            ...data.endereco,
            codigoCidade: data.endereco.codigoIbgeCidade,
            codigoIbgeUf: data.endereco.codigoIbgeUf
          }
        }

        // Cadastrar no eNotas
        const { data: enotasEmpresa } = await enotasService.cadastrarEmpresa(enotasData)

        // Configurar webhook para a empresa
        const { data: webhookData } = await enotasService.configurarWebhook(enotasEmpresa.id)

        // Vincular empresa ao usuário no Supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const empresaSupabase: Partial<EmpresaSupabase> = {
          user_id: user.id,
          cnpj: data.cnpj,
          razao_social: data.razaoSocial,
          nome_fantasia: data.nomeFantasia,
          status_cadastro: 'pendente',
          webhook_id: webhookData.id,
          enotas_id: enotasEmpresa.id // Salvando o ID retornado pelo eNotas
        }

        await supabase.from('empresas').insert(empresaSupabase)

        // Recarregar dados da empresa
        await recarregarEmpresa()

        return enotasEmpresa
      } catch (error) {
        console.error('Erro ao cadastrar empresa:', error)
        throw error
      }
    }
  })

  // Vincular certificado digital
  const vincularCertificado = useMutation({
    mutationFn: async ({ empresaId, arquivo, senha }: VincularCertificadoParams) => {
      const formData = new FormData()
      formData.append('arquivo', arquivo)
      formData.append('senha', senha)

      // Usar o enotas_id para vincular o certificado
      const response = await enotasService.vincularCertificado(
        empresa?.enotas_id || empresaId, 
        formData
      )
      
      // Recarregar dados da empresa após vincular certificado
      await recarregarEmpresa()

      return response.data
    }
  })

  return {
    empresa,
    isLoading,
    error,
    cadastrarEmpresa,
    vincularCertificado,
    recarregarEmpresa
  }
}
