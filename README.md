# EmissorNF - Sistema de Emissão de Notas Fiscais

Sistema web para emissão e gerenciamento de notas fiscais integrado com a API do eNotas.

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- TailwindCSS
- React Query
- React Router DOM
- React Hook Form + Zod
- Supabase (Autenticação e Banco de Dados)
- eNotas API

## Funcionalidades

- [x] Autenticação de usuários
- [x] Cadastro e gerenciamento de empresas
- [x] Upload de certificado digital
- [x] Emissão de notas fiscais
- [x] Listagem e acompanhamento de notas emitidas
- [x] Dashboard com métricas e informações relevantes

## Pré-requisitos

- Node.js >= 16
- NPM ou Yarn
- Conta no Supabase
- Conta no eNotas

## Configuração do Ambiente

### 1. Clone o repositório:
```bash
git clone https://github.com/itadigitaloficial/emissor.git
cd emissor
```

### 2. Configure o Banco de Dados (Supabase):

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. No Editor SQL do Supabase, execute o script SQL localizado em `supabase/schema.sql`
   - Este script irá criar todas as tabelas necessárias:
     - empresas
     - enderecos
     - certificados
     - notas_fiscais
   - Também configura:
     - Políticas de segurança (RLS)
     - Triggers para atualização automática
     - Índices para melhor performance

### 3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_ENOTAS_API_KEY=sua_chave_api_do_enotas
```

### 4. Instale as dependências:
```bash
npm install
```

### 5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos do React
  ├── hooks/          # Hooks personalizados
  ├── lib/           # Configurações de bibliotecas
  ├── pages/         # Páginas da aplicação
  ├── types/         # Tipos TypeScript
  └── utils/         # Funções utilitárias
supabase/
  └── schema.sql     # Script de criação do banco de dados
```

## Estrutura do Banco de Dados

### Tabela: empresas
- Armazena informações básicas das empresas
- Vinculada ao usuário através do `user_id`
- Possui políticas de segurança por usuário

### Tabela: enderecos
- Armazena endereços das empresas
- Vinculada à empresa através do `empresa_id`
- Herda políticas de segurança da empresa

### Tabela: certificados
- Gerencia certificados digitais
- Controla validade e data de expiração
- Vinculada à empresa através do `empresa_id`

### Tabela: notas_fiscais
- Registra todas as notas fiscais emitidas
- Armazena informações do tomador e serviço
- Vinculada à empresa através do `empresa_id`

## Fluxo de Emissão de Notas

1. Usuário se cadastra/faz login
2. Cadastra os dados da empresa
3. Faz upload do certificado digital
4. Acessa a página de emissão de notas
5. Preenche os dados da nota fiscal
6. Sistema envia para a API do eNotas
7. Nota é emitida e listada no dashboard

## Desenvolvimento

### Comandos Úteis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build localmente
- `npm run lint` - Executa o linter

### Boas Práticas

- Utilize TypeScript para tipagem estática
- Siga os padrões do ESLint
- Mantenha os componentes pequenos e focados
- Use os hooks personalizados para lógica reutilizável
- Documente funções e componentes complexos

## Deploy

O projeto está configurado para deploy na Netlify. O processo de deploy é automático a partir do push na branch main.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Para suporte, envie um email para suporte@itadigital.com.br ou abra uma issue no GitHub.
