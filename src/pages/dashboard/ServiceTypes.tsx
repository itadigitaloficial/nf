import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTiposServico } from '../../hooks/useTiposServico'
import { Tags, Plus, AlertCircle, Check, Pencil, Trash2 } from 'lucide-react'
import { TipoServico } from '../../types/servico'

const tipoServicoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional()
})

type TipoServicoForm = z.infer<typeof tipoServicoSchema>

export default function ServiceTypes() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    tiposServico,
    isLoading,
    criarTipoServico,
    atualizarTipoServico,
    deletarTipoServico
  } = useTiposServico()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TipoServicoForm>({
    resolver: zodResolver(tipoServicoSchema)
  })

  const onSubmit = async (data: TipoServicoForm) => {
    try {
      setError('')
      setSuccess('')

      if (editingId) {
        await atualizarTipoServico.mutateAsync({ id: editingId, ...data })
        setSuccess('Tipo de serviço atualizado com sucesso!')
      } else {
        await criarTipoServico.mutateAsync(data)
        setSuccess('Tipo de serviço criado com sucesso!')
      }

      setShowForm(false)
      setEditingId(null)
      reset()
    } catch (err) {
      setError('Erro ao salvar tipo de serviço. Verifique os dados e tente novamente.')
    }
  }

  const handleEdit = (tipo: TipoServico) => {
    setEditingId(tipo.id)
    setShowForm(true)
    setValue('nome', tipo.nome)
    setValue('descricao', tipo.descricao || '')
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de serviço?')) {
      try {
        await deletarTipoServico.mutateAsync(id)
        setSuccess('Tipo de serviço excluído com sucesso!')
      } catch (err) {
        setError('Erro ao excluir tipo de serviço. Verifique se não há serviços vinculados.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Tags className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Serviço</h1>
            <p className="text-sm text-gray-600">
              Gerencie os tipos de serviço disponíveis
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            reset()
          }}
          className="flex items-center space-x-2 btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Tipo</span>
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
              {editingId ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <div className="mt-1">
                  <input
                    {...register('nome')}
                    type="text"
                    className="input"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição (opcional)
                </label>
                <div className="mt-1">
                  <textarea
                    {...register('descricao')}
                    rows={3}
                    className="input"
                  />
                  {errors.descricao && (
                    <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    reset()
                  }}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Tipos de Serviço */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Tipos de Serviço Cadastrados
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
            </div>
          ) : tiposServico && tiposServico.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tiposServico.map((tipo) => (
                    <tr key={tipo.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {tipo.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {tipo.descricao || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(tipo)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tipo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Nenhum tipo de serviço cadastrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
