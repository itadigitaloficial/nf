import { Link } from 'react-router-dom'
import { FileText, Shield, Zap, Check } from 'lucide-react'

const features = [
  {
    icon: <FileText className="w-12 h-12 text-primary-600" />,
    title: 'Emissão Simplificada',
    description: 'Emita notas fiscais de forma rápida e intuitiva, sem complicações.'
  },
  {
    icon: <Shield className="w-12 h-12 text-primary-600" />,
    title: 'Segurança Garantida',
    description: 'Seus dados e documentos protegidos com a mais alta segurança.'
  },
  {
    icon: <Zap className="w-12 h-12 text-primary-600" />,
    title: 'Processo Ágil',
    description: 'Automatize seus processos e ganhe tempo no seu dia a dia.'
  }
]

const plans = [
  {
    name: 'Básico',
    price: 'R$ 49,90',
    features: [
      'Até 50 notas por mês',
      'Suporte por email',
      'Dashboard básico',
      'Certificado digital (não incluso)'
    ]
  },
  {
    name: 'Profissional',
    price: 'R$ 99,90',
    featured: true,
    features: [
      'Até 200 notas por mês',
      'Suporte prioritário',
      'Dashboard completo',
      'Certificado digital (não incluso)',
      'Relatórios avançados'
    ]
  },
  {
    name: 'Empresarial',
    price: 'R$ 199,90',
    features: [
      'Notas ilimitadas',
      'Suporte 24/7',
      'Dashboard personalizado',
      'Certificado digital incluso',
      'Relatórios personalizados',
      'API de integração'
    ]
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <nav className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center">
            <img 
              src="https://cliente.itadigital.com.br/logo_itadigital.png" 
              alt="Ita Digital Logo" 
              className="h-8 mr-2"
            />
            <span className="text-2xl font-bold text-primary-600">EmissorNF</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Cadastre-se
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Emissão de Notas Fiscais Simplificada
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-primary-100">
              Automatize sua emissão de notas fiscais de forma rápida e segura
            </p>
            <Link to="/register" className="text-lg bg-white btn text-primary-600 hover:bg-primary-50">
              Comece Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">Recursos Principais</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="text-center transition-shadow card hover:shadow-lg">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">Planos</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`card hover:shadow-lg transition-shadow relative ${
                  plan.featured ? 'border-2 border-primary-500 shadow-lg' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 px-4 py-1 text-sm font-medium text-white rounded-tr-lg rounded-bl-lg bg-primary-500">
                    Mais Popular
                  </div>
                )}
                <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                <p className="mb-6 text-3xl font-bold text-primary-600">
                  {plan.price}
                  <span className="text-sm text-gray-600">/mês</span>
                </p>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 mr-2 text-primary-600" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`btn w-full text-center ${
                    plan.featured ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Começar Agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 text-2xl font-bold">EmissorNF</div>
            <p className="text-gray-400">© 2024 EmissorNF. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
