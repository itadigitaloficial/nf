import { useAuth } from '../../contexts/AuthContext'
import { useEmpresas } from '../../hooks/useEmpresas'
import { useNotas } from '../../hooks/useNotas'
import { FileText, Building2, AlertCircle, DollarSign } from 'lucide-react'
import { NotaFiscal } from '../../types/nota'

export default function Overview() {
  const { user } = useAuth()
  const { empresa, isLoading: isLoadingEmpresa } = useEmpresas()
  const { notas, isLoading: isLoadingNotas } = useNotas()

  // Cálculos para os cards
  const totalNotas = notas?.length || 0
  const notasUltimoMes = notas?.filter((nota: NotaFiscal) => {
    const dataEmissao = new Date(nota.dataEmissao)
    const umMesAtras = new Date()
    umMesAtras.setMonth(umMesAtras.getMonth() - 1)
    return dataEmissao >= umMesAtras
  }).length || 0

  const valorTotalNotas = notas?.reduce((total: number, nota: NotaFiscal) => total + nota.valorTotal, 0) || 0

  const cards = [
    {
      title: 'Total de Notas',
      value: totalNotas.toString(),
      description: 'emitidas',
      icon: <FileText className="w-8 h-8 text-primary-600" />
    },
    {
      title: 'Notas no Último Mês',
      value: notasUltimoMes.toString(),
      description: 'últimos 30 dias',
      icon: <Building2 className="w-8 h-8 text-primary-600" />
    },
    {
      title: 'Valor Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valorTotalNotas),
      description: 'em notas emitidas',
      icon: <DollarSign className="w-8 h-8 text-primary-600" />
    }
  ]

  if (isLoadingEmpresa || isLoadingNotas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.email}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Aqui está um resumo da sua atividade
        </p>
      </div>

      {!empresa && (
        <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Você ainda não cadastrou sua empresa.{' '}
                <a href="/dashboard/company" className="font-medium underline hover:text-yellow-600">
                  Cadastre agora
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div key={index} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimas Notas */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Últimas Notas Emitidas
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {notas && notas.length > 0 ? (
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
                  {notas.slice(0, 5).map((nota: NotaFiscal) => (
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
