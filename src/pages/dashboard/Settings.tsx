import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEmpresas } from '../../hooks/useEmpresas'
import { Upload, AlertCircle, Check } from 'lucide-react'

const certificateSchema = z.object({
  arquivo: z.instanceof(FileList)
    .refine((files) => files.length > 0, 'Arquivo é obrigatório')
    .refine((files) => files[0]?.size <= 5000000, 'O arquivo deve ter no máximo 5MB')
    .refine(
      (files) => ['application/x-pkcs12'].includes(files[0]?.type),
      'Apenas arquivos .pfx são permitidos'
    ),
  senha: z.string().min(1, 'Senha do certificado é obrigatória')
})

type CertificateForm = z.infer<typeof certificateSchema>

export default function Settings() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { empresa, vincularCertificado } = useEmpresas()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CertificateForm>({
    resolver: zodResolver(certificateSchema)
  })

  const onSubmit = async (data: CertificateForm) => {
    try {
      setError('')
      setSuccess('')

      if (!empresa?.id) {
        setError('Empresa não encontrada. Cadastre sua empresa primeiro.')
        return
      }

      const file = data.arquivo[0]
      if (!file) {
        setError('Arquivo do certificado é obrigatório')
        return
      }

      await vincularCertificado.mutateAsync({
        empresaId: empresa.id,
        arquivo: file,
        senha: data.senha
      })

      setSuccess('Certificado digital vinculado com sucesso!')
    } catch (err) {
      setError('Erro ao vincular certificado digital. Verifique os dados e tente novamente.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie as configurações da sua conta e certificado digital
        </p>
      </div>

      {/* Certificado Digital */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Certificado Digital
          </h3>
          <div className="max-w-xl mt-2 text-sm text-gray-500">
            <p>
              Faça upload do seu certificado digital A1 no formato .pfx para emissão de notas fiscais.
            </p>
          </div>

          {error && (
            <div className="p-4 mt-4 border-l-4 border-red-400 bg-red-50">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 mt-4 border-l-4 border-green-400 bg-green-50">
              <div className="flex">
                <Check className="w-5 h-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arquivo do Certificado (.pfx)
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  accept=".pfx"
                  {...register('arquivo')}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {errors.arquivo && (
                  <p className="mt-1 text-sm text-red-600">{errors.arquivo.message as string}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha do Certificado
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  {...register('senha')}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••"
                />
                {errors.senha && (
                  <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Enviar Certificado'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Outras configurações podem ser adicionadas aqui */}
    </div>
  )
}
