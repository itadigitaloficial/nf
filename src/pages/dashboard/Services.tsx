import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useServicos } from '../../hooks/useServicos'
import { Briefcase, Plus, AlertCircle, Check, Pencil, Trash2 } from 'lucide-react'
import { ServicoInput } from '../../types/servico'

const servicoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipo_servico_id: z.string().min(1, 'Tipo de serviço é obrigatório'),
  categoria_servico_id: z.string().min(1, 'Categoria é obrigatória'),
  prazo_inicio: z.number().min(0, 'Prazo de início deve ser maior ou igual a 0'),
  prazo_entrega: z.number().min(1, 'Prazo de entrega deve ser maior que 0'),
  valor: z.number().min(0, 'Valor deve ser maior ou igual a 0'),
  descricao: z.string().optional()
})

type ServicoForm = z.infer<typeof servicoSchema>

export default function Services() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    servicos,
    isLoading,
    tiposServico,
    categoriasServico,
    criarServico,
    atualizarServico,
    deletarServico
  } = useServicos()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ServicoForm>({
    resolver: zodResolver(servicoSchema)
  })

  const onSubmit = async (data: ServicoForm) => {
    try {
      setError('')
      setSuccess('')

      const servicoInput: ServicoInput = {
        ...data,
        prazo_inicio: Number(data.prazo_inicio),
        prazo_entrega: Number(data.prazo_entrega),
        valor: Number(data.valor)
      }

      if (editingId) {
        await atualizarServico.mutateAsync({ id: editingId, ...servicoInput })
        setSuccess('Serviço atualizado com sucesso!')
      } else {
        await criarServico.mutateAsync(servicoInput)
        setSuccess('Serviço criado com sucesso!')
      }

      setShowForm(false)
      setEditingId(null)
      reset()
    } catch (err) {
      setError('Erro ao salvar serviço. Verifique os dados e tente novamente.')
    }
  }

  const handleEdit = (servico: ServicoInput & { id: string }) => {
    setEditingId(servico.id)
    setShowForm(true)
    Object.entries(servico).forEach(([key, value]) => {
      setValue(key as keyof ServicoForm, value)
    })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deletarServico.mutateAsync(id)
        setSuccess('Serviço excluído com sucesso!')
      } catch (err) {
        setError('Erro ao excluir serviço.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Briefcase className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
            <p className="text-sm text-gray-600">
              Gerencie seus serviços
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
          <span>Novo Serviço</span>
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
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Serviço
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
                    Tipo de Serviço
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('tipo_servico_id')}
                      className="input"
                    >
                      <option value="">Selecione um tipo</option>
                      {tiposServico?.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                    {errors.tipo_servico_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.tipo_servico_id.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('categoria_servico_id')}
                      className="input"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categoriasServico?.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                    {errors.categoria_servico_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoria_servico_id.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prazo de Início (dias)
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('prazo_inicio', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="input"
                    />
                    {errors.prazo_inicio && (
                      <p className="mt-1 text-sm text-red-600">{errors.prazo_inicio.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prazo de Entrega (dias)
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('prazo_entrega', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="input"
                    />
                    {errors.prazo_entrega && (
                      <p className="mt-1 text-sm text-red-600">{errors.prazo_entrega.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('valor', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="input"
                    />
                    {errors.valor && (
                      <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição Complementar
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

      {/* Lista de Serviços */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Serviços Cadastrados
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
            </div>
          ) : servicos && servicos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicos.map((servico) => (
                    <tr key={servico.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {servico.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {servico.tipo_servico?.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {servico.categoria_servico?.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(servico.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                            servico.status === 'ativo'
                              ? 'text-green-800 bg-green-100'
                              : 'text-red-800 bg-red-100'
                          }`}
                        >
                          {servico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(servico)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(servico.id)}
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
              Nenhum serviço cadastrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
