import { useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Building2,
  FileText,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  Tags,
  FolderTree
} from 'lucide-react'
import { NotificationBell } from '../components/notifications/NotificationBell'

import Overview from './dashboard/Overview'
import Company from './dashboard/Company'
import Invoices from './dashboard/Invoices'
import Settings from './dashboard/Settings'
import Certificates from './dashboard/Certificates'
import Services from './dashboard/Services'
import ServiceTypes from './dashboard/ServiceTypes'
import ServiceCategories from './dashboard/ServiceCategories'

interface BaseMenuItem {
  icon?: React.ReactNode
  label: string
}

interface RegularMenuItem extends BaseMenuItem {
  path: string
  type?: never
  items?: never
}

interface GroupMenuItem extends BaseMenuItem {
  type: 'group'
  path?: never
  items: RegularMenuItem[]
}

type MenuItem = RegularMenuItem | GroupMenuItem

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Visão Geral'
  },
  {
    path: '/dashboard/company',
    icon: <Building2 className="w-5 h-5" />,
    label: 'Empresa'
  },
  {
    path: '/dashboard/certificates',
    icon: <Shield className="w-5 h-5" />,
    label: 'Certificados'
  },
  {
    path: '/dashboard/invoices',
    icon: <FileText className="w-5 h-5" />,
    label: 'Notas Fiscais'
  },
  {
    type: 'group',
    label: 'Serviços',
    items: [
      {
        path: '/dashboard/services',
        icon: <Briefcase className="w-5 h-5" />,
        label: 'Serviços'
      },
      {
        path: '/dashboard/service-types',
        icon: <Tags className="w-5 h-5" />,
        label: 'Tipos'
      },
      {
        path: '/dashboard/service-categories',
        icon: <FolderTree className="w-5 h-5" />,
        label: 'Categorias'
      }
    ]
  },
  {
    path: '/dashboard/settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    label: 'Configurações'
  }
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="https://cliente.itadigital.com.br/logo_itadigital.png" 
                alt="Ita Digital Logo" 
                className="h-8 mr-2"
              />
              <span className="text-xl font-bold text-primary-600">EmissorNF</span>
            </Link>
            <button
              className="text-gray-500 lg:hidden hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary-100">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Plano Profissional
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              if (item.type === 'group' && item.items) {
                return (
                  <div key={index} className="space-y-1">
                    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase">
                      {item.label}
                    </h3>
                    {item.items.map((subItem) => {
                      const isActive = location.pathname === subItem.path
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.icon}
                          <span className="ml-3">{subItem.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )
              } else {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path || '/dashboard'}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )
              }
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
          <button
            className="text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Notifications and user menu */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/company" element={<Company />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-types" element={<ServiceTypes />} />
            <Route path="/service-categories" element={<ServiceCategories />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
