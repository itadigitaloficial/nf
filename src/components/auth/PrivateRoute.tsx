import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function PrivateRoute() {
  const { user, isLoading } = useAuth()

  // Mostra nada enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    )
  }

  // Redireciona para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Renderiza as rotas protegidas se estiver autenticado
  return <Outlet />
}
