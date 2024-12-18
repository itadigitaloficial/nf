import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCertificados } from '../../hooks/useCertificados'
import { useEmpresas } from '../../hooks/useEmpresas'
import { Shield, AlertCircle, Check, Upload, XCircle, Clock } from 'lucide-react'

const uploadSchema = z.object({
  arquivo: z.instanceof(File, { message: 'Selecione um arquivo' }),
  senha: z.string().min(1, 'Senha é obrigatória'),
  tipo: z.enum(['A1', 'A3'], { required_error: 'Selecione o tipo' })
})

type UploadForm = z.infer<typeof uploadSchema>

export default function Certificates() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { empresa } = useEmpresas()
  const { certificados, isLoading, uploadCertificado, revogarCertificado } = useCertificados()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema)
  })

  const onSubmit = async (data: UploadForm) => {
    try {
      setError('')
      setSuccess('')

      if (!empresa) {
        setError('Empresa não encontrada')
        return
      }

      await uploadCertificado.mutateAsync({
        empresaId: empresa.id!,
        arquivo: data.arquivo,
        senha: data.senha,
        tipo: data.tipo
      })

      setSuccess('Certificado digital enviado com sucesso!')
      reset()
    } catch (err) {
      setError('Erro ao enviar certificado. Verifique os dados e tente novamente.')
    }
  }

  const handleRevogar = async (certificadoId: string) => {
    try {
      setError('')
      setSuccess('')
      await revogarCertificado.mutateAsync(certificadoId)
      setSuccess('Certificado revogado com sucesso!')
    } catch (err) {
      setError('Erro ao revogar certificado.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 space-x-4">
        <Shield className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Certificados Digitais
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie os certificados digitais da sua empresa
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 bg-red-50">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 border-l-4 border-green-400 bg-green-50">
          <div className="flex">
            <Check className="w-5 h-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Upload de Certificado
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arquivo do Certificado
              </label>
              <input
                type="file"
                accept=".pfx,.p12"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    register('arquivo').onChange(e)
                  }
                }}
                className="mt-1 input"
              />
              {errors.arquivo && (
                <p className="mt-1 text-sm text-red-600">{errors.arquivo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                {...register('senha')}
                type="password"
                className="mt-1 input"
              />
              {errors.senha && (
                <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                {...register('tipo')}
                className="mt-1 input"
              >
                <option value="">Selecione o tipo</option>
                <option value="A1">A1</option>
                <option value="A3">A3</option>
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Certificado
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Certificados Cadastrados
          </h2>
          <div className="space-y-4">
            {certificados?.length === 0 ? (
              <p className="text-gray-500">Nenhum certificado cadastrado.</p>
            ) : (
              certificados?.map((certificado) => (
                <div
                  key={certificado.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {certificado.nome}
                      </h3>
                      <div className="mt-1 space-y-1 text-sm text-gray-500">
                        <p>Tipo: {certificado.tipo}</p>
                        <p>
                          Validade: {new Date(certificado.dataValidade).toLocaleDateString()}
                        </p>
                        <p>
                          Upload: {new Date(certificado.dataUpload).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${certificado.status === 'ATIVO' ? 'bg-green-100 text-green-700' : ''}
                        ${certificado.status === 'EXPIRADO' ? 'bg-red-100 text-red-700' : ''}
                        ${certificado.status === 'REVOGADO' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {certificado.status}
                      </div>
                      {certificado.status === 'ATIVO' && (
                        <>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {certificado.diasParaExpirar} dias para expirar
                          </div>
                          <button
                            onClick={() => handleRevogar(certificado.id)}
                            className="flex items-center px-2 py-1 mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Revogar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
