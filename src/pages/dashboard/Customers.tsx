import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTomadores } from '../../hooks/useTomadores'
import { useEmpresas } from '../../hooks/useEmpresas'
import { Shield, AlertCircle, Check, XCircle } from 'lucide-react'

const tomadorSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  cpfCnpj: z.string().min(11, 'CNPJ/CPF é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  endereco: z.object({
    cep: z.string().min(8, 'CEP é obrigatório'),
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres')
  })
})

type TomadorForm = z.infer<typeof tomadorSchema>

export default function Customers() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const { tomadores, isLoading, adicionarTomador, removerTomador } = useTomadores()
  const { empresa } = useEmpresas()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TomadorForm>({
    resolver: zodResolver(tomadorSchema)
  })

  const onSubmit = async (data: TomadorForm) => {
    try {
      setError('')
      setSuccess('')

      if (!empresa) {
        setError('Empresa não encontrada')
        return
      }

      await adicionarTomador.mutateAsync({
        razaoSocial: data.razaoSocial,
        cpfCnpj: data.cpfCnpj,
        email: data.email || '', // Garantindo que não seja undefined
        telefone: data.telefone || '', // Garantindo que não seja undefined
        endereco: {
          cep: data.endereco.cep,
          logradouro: data.endereco.logradouro,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento || '', // Garantindo que não seja undefined
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          uf: data.endereco.uf
        }
      })

      setSuccess('Tomador adicionado com sucesso!')
      reset()
    } catch (err) {
      setError('Erro ao adicionar tomador. Verifique os dados e tente novamente.')
    }
  }

  const handleRevogar = async (tomadorId: string) => {
    try {
      setError('')
      setSuccess('')
      await removerTomador.mutateAsync(tomadorId)
      setSuccess('Tomador removido com sucesso!')
    } catch (err) {
      setError('Erro ao remover tomador.')
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
            Tomadores
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie os tomadores da sua empresa
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
            Adicionar Tomador
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Razão Social
              </label>
              <input
                {...register('razaoSocial')}
                type="text"
                className="mt-1 input"
              />
              {errors.razaoSocial && (
                <p className="mt-1 text-sm text-red-600">{errors.razaoSocial.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ/CPF
              </label>
              <input
                {...register('cpfCnpj')}
                type="text"
                className="mt-1 input"
              />
              {errors.cpfCnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cpfCnpj.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 input"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                {...register('telefone')}
                type="text"
                className="mt-1 input"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Endereço</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  {...register('endereco.cep')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.cep && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.cep.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logradouro
                </label>
                <input
                  {...register('endereco.logradouro')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.logradouro && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.logradouro.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  {...register('endereco.numero')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.numero && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.numero.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  {...register('endereco.complemento')}
                  type="text"
                  className="mt-1 input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  {...register('endereco.bairro')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.bairro && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.bairro.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  {...register('endereco.cidade')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.cidade && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.cidade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  UF
                </label>
                <input
                  {...register('endereco.uf')}
                  type="text"
                  className="mt-1 input"
                />
                {errors.endereco?.uf && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.uf.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar Tomador'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Tomadores Cadastrados
          </h2>
          <div className="space-y-4">
            {tomadores?.length === 0 ? (
              <p className="text-gray-500">Nenhum tomador cadastrado.</p>
            ) : (
              tomadores?.map((tomador) => (
                <div key={tomador.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    {tomador.razao_social}
                  </h3>
                  <p className="text-sm text-gray-500">CNPJ/CPF: {tomador.cpf_cnpj}</p>
                  <p className="text-sm text-gray-500">Email: {tomador.email}</p>
                  <p className="text-sm text-gray-500">Telefone: {tomador.telefone}</p>
                  <button
                    onClick={() => handleRevogar(tomador.id)}
                    className="flex items-center px-2 py-1 mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
