export interface Tomador {
  razaoSocial: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

export interface TomadorSupabase {
  id: string;
  user_id: string;
  razao_social: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  created_at: string;
  updated_at: string;
}
