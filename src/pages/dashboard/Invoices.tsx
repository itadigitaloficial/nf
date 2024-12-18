import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNotas } from '../../hooks/useNotas'
import { useEmpresas } from '../../hooks/useEmpresas'
import { FileText, Plus, AlertCircle, Check } from 'lucide-react'
import { NotaFiscal, NotaFiscalInput } from '../../types/nota'

const notaSchema = z.object({
  valorTotal: z.string().min(1, 'Valor total é obrigatório'),
  servico: z.object({
    descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
    codigoServico: z.string().min(1, 'Código do serviço é obrigatório')
  }),
  tomador: z.object({
    razaoSocial: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido')
  })
})

type NotaForm = z.infer<typeof notaSchema>

export default function Invoices() {
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { empresa } = useEmpresas()
  const { notas, emitirNota, isLoading } = useNotas()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NotaForm>({
    resolver: zodResolver(notaSchema)
  })

  const onSubmit = async (data: NotaForm) => {
    try {
      setError('')
      setSuccess('')

      if (!empresa?.id) {
        setError('Empresa não encontrada. Cadastre sua empresa primeiro.')
        return
      }

      const notaInput: NotaFiscalInput = {
        tipo: 'NFS-e',
        valorTotal: parseFloat(data.valorTotal),
        servico: {
          descricao: data.servico.descricao,
          codigoServico: data.servico.codigoServico
        },
        tomador: {
          razaoSocial: data.tomador.razaoSocial,
          email: data.tomador.email,
          cpfCnpj: data.tomador.cpfCnpj
        }
      }

      await emitirNota.mutateAsync(notaInput)
      setSuccess('Nota fiscal emitida com sucesso!')
      setShowForm(false)
      reset()
    } catch (err) {
      setError('Erro ao emitir nota fiscal. Verifique os dados e tente novamente.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notas Fiscais</h1>
            <p className="text-sm text-gray-600">
              Gerencie suas notas fiscais
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Nota</span>
        </button>
      </div>

      {error && (
        <div className="p-4 border-l-4 border-red-400 bg-red-50">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 border-l-4 border-green-400 bg-green-50">
          <div className="flex">
            <Check className="w-5 h-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
              Emitir Nova Nota Fiscal
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor Total
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('valorTotal')}
                      type="number"
                      step="0.01"
                      className="input"
                      placeholder="0.00"
                    />
                    {errors.valorTotal && (
                      <p className="mt-1 text-sm text-red-600">{errors.valorTotal.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição do Serviço
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('servico.descricao')}
                      type="text"
                      className="input"
                    />
                    {errors.servico?.descricao && (
                      <p className="mt-1 text-sm text-red-600">{errors.servico.descricao.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código do Serviço
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('servico.codigoServico')}
                      type="text"
                      className="input"
                    />
                    {errors.servico?.codigoServico && (
                      <p className="mt-1 text-sm text-red-600">{errors.servico.codigoServico.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Razão Social do Tomador
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('tomador.razaoSocial')}
                      type="text"
                      className="input"
                    />
                    {errors.tomador?.razaoSocial && (
                      <p className="mt-1 text-sm text-red-600">{errors.tomador.razaoSocial.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email do Tomador
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('tomador.email')}
                      type="email"
                      className="input"
                    />
                    {errors.tomador?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.tomador.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CPF/CNPJ do Tomador
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('tomador.cpfCnpj')}
                      type="text"
                      className="input"
                    />
                    {errors.tomador?.cpfCnpj && (
                      <p className="mt-1 text-sm text-red-600">{errors.tomador.cpfCnpj.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Emitindo...' : 'Emitir Nota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Notas */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Notas Fiscais Emitidas
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
            </div>
          ) : notas && notas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Número
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Tomador
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notas.map((nota: NotaFiscal) => (
                    <tr key={nota.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {nota.numero}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(nota.dataEmissao).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {nota.tomador.razaoSocial}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(nota.valorTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          {nota.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Nenhuma nota fiscal emitida ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
