import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEmpresas } from '../../hooks/useEmpresas'
import { useIBGE } from '../../hooks/useIBGE'
import { Building2, AlertCircle, Check } from 'lucide-react'

const companySchema = z.object({
  razaoSocial: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  nomeFantasia: z.string().min(3, 'Nome fantasia deve ter no mínimo 3 caracteres'),
  cnpj: z.string()
    .length(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d+$/, 'CNPJ deve conter apenas números'),
  inscricaoMunicipal: z.string().min(1, 'Inscrição municipal é obrigatória'),
  email: z.string().email('Email inválido'),
  telefone: z.string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
  endereco: z.object({
    cep: z.string()
      .length(8, 'CEP deve ter 8 dígitos')
      .regex(/^\d+$/, 'CEP deve conter apenas números'),
    logradouro: z.string().min(3, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    bairro: z.string().min(3, 'Bairro é obrigatório'),
    cidade: z.string().min(3, 'Cidade é obrigatória'),
    uf: z.string().length(2, 'UF deve ter 2 caracteres'),
    codigoIbgeUf: z.number(),
    codigoIbgeCidade: z.number()
  })
})

type CompanyForm = z.infer<typeof companySchema>

export default function Company() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { empresa, cadastrarEmpresa, isLoading } = useEmpresas()
  const { estados, getCidades } = useIBGE()
  const [selectedUF, setSelectedUF] = useState('')
  const { data: cidades } = getCidades(selectedUF)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: empresa || undefined
  })

  const onSubmit = async (data: CompanyForm) => {
    try {
      setError('')
      setSuccess('')
      await cadastrarEmpresa.mutateAsync(data)
      setSuccess('Empresa cadastrada com sucesso!')
    } catch (err) {
      setError('Erro ao cadastrar empresa. Verifique os dados e tente novamente.')
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Building2 className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {empresa ? 'Dados da Empresa' : 'Cadastrar Empresa'}
            </h1>
            <p className="text-sm text-gray-600">
              {empresa 
                ? 'Atualize os dados da sua empresa quando necessário'
                : 'Cadastre os dados da sua empresa para emissão de notas fiscais'
              }
            </p>
          </div>
        </div>
        
        {empresa && (
          <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status do Cadastro:</span>
              {empresa.status_cadastro === 'pendente' && (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                  <p className="text-sm text-gray-500">
                    Aguardando confirmação do eNotas
                  </p>
                </>
              )}
              {empresa.status_cadastro === 'ativo' && (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                  <p className="text-sm text-gray-500">
                    Empresa cadastrada e pronta para emitir notas
                  </p>
                </>
              )}
              {empresa.status_cadastro === 'erro' && (
                <>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Erro
                  </span>
                  <p className="text-sm text-gray-500">
                    Houve um problema no cadastro. Por favor, verifique os dados
                  </p>
                </>
              )}
            </div>
          </div>
        )}
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

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                Nome Fantasia
              </label>
              <input
                {...register('nomeFantasia')}
                type="text"
                className="mt-1 input"
              />
              {errors.nomeFantasia && (
                <p className="mt-1 text-sm text-red-600">{errors.nomeFantasia.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <input
                {...register('cnpj')}
                type="text"
                className="mt-1 input"
                placeholder="00000000000000"
              />
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inscrição Municipal
              </label>
              <input
                {...register('inscricaoMunicipal')}
                type="text"
                className="mt-1 input"
              />
              {errors.inscricaoMunicipal && (
                <p className="mt-1 text-sm text-red-600">{errors.inscricaoMunicipal.message}</p>
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
                placeholder="00000000000"
              />
              {errors.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Endereço</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <input
                    {...register('endereco.cep')}
                    type="text"
                    className="mt-1 input"
                    placeholder="00000000"
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
                  {errors.endereco?.complemento && (
                    <p className="mt-1 text-sm text-red-600">{errors.endereco.complemento.message}</p>
                  )}
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
                    UF
                  </label>
                  <select
                    {...register('endereco.uf')}
                    className="mt-1 input"
                    onChange={(e) => {
                      const uf = e.target.value
                      setSelectedUF(uf)
                      const estado = estados?.find(estado => estado.sigla === uf)
                      if (estado) {
                        setValue('endereco.codigoIbgeUf', estado.id)
                      }
                    }}
                  >
                    <option value="">Selecione o estado</option>
                    {estados?.map(estado => (
                      <option key={estado.id} value={estado.sigla}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                  {errors.endereco?.uf && (
                    <p className="mt-1 text-sm text-red-600">{errors.endereco.uf.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <select
                    className="mt-1 input"
                    onChange={(e) => {
                      const cidadeId = Number(e.target.value)
                      const cidade = cidades?.find(cidade => cidade.id === cidadeId)
                      if (cidade) {
                        setValue('endereco.cidade', cidade.nome)
                        setValue('endereco.codigoIbgeCidade', cidade.id)
                      }
                    }}
                    disabled={!selectedUF}
                  >
                    <option value="">Selecione a cidade</option>
                    {cidades?.map(cidade => (
                      <option key={cidade.id} value={cidade.id}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                  <input
                    type="hidden"
                    {...register('endereco.cidade')}
                  />
                  {errors.endereco?.cidade && (
                    <p className="mt-1 text-sm text-red-600">{errors.endereco.cidade.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Salvando...' : empresa ? 'Atualizar Dados' : 'Cadastrar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
