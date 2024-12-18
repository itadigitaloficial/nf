 -- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de empresas
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(14) NOT NULL,
    inscricao_municipal VARCHAR(20),
    email VARCHAR(255),
    telefone VARCHAR(20),
    cep VARCHAR(8),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    uf VARCHAR(2),
    status_cadastro VARCHAR(50) DEFAULT 'pendente',
    webhook_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notas_fiscais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id),
    numero VARCHAR(50),
    status_emissao VARCHAR(50) DEFAULT 'pendente',
    valor_total DECIMAL(10,2),
    data_emissao TIMESTAMP WITH TIME ZONE,
    tomador_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON empresas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notas_fiscais_updated_at
    BEFORE UPDATE ON notas_fiscais
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255) NOT NULL,
    inscricao_municipal VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de endereços das empresas
CREATE TABLE enderecos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de certificados digitais
CREATE TABLE certificados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    valido BOOLEAN DEFAULT true,
    data_validade TIMESTAMP WITH TIME ZONE NOT NULL,
    data_upload TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo VARCHAR(2) NOT NULL CHECK (tipo IN ('A1', 'A3')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('ATIVO', 'EXPIRADO', 'REVOGADO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas fiscais
CREATE TABLE notas_fiscais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    numero VARCHAR(50) NOT NULL,
    serie VARCHAR(10),
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    tomador_razao_social VARCHAR(255) NOT NULL,
    tomador_cnpj_cpf VARCHAR(14) NOT NULL,
    tomador_email VARCHAR(255),
    servico_descricao TEXT NOT NULL,
    servico_codigo VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON empresas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at
    BEFORE UPDATE ON enderecos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_certificados_updated_at
    BEFORE UPDATE ON certificados
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notas_fiscais_updated_at
    BEFORE UPDATE ON notas_fiscais
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;

-- Política para empresas
CREATE POLICY "Usuários podem ver apenas suas próprias empresas"
    ON empresas FOR ALL
    USING (auth.uid() = user_id);

-- Política para endereços
CREATE POLICY "Usuários podem ver apenas endereços de suas empresas"
    ON enderecos FOR ALL
    USING (EXISTS (
        SELECT 1 FROM empresas
        WHERE empresas.id = enderecos.empresa_id
        AND empresas.user_id = auth.uid()
    ));

-- Política para certificados
CREATE POLICY "Usuários podem ver apenas certificados de suas empresas"
    ON certificados FOR ALL
    USING (EXISTS (
        SELECT 1 FROM empresas
        WHERE empresas.id = certificados.empresa_id
        AND empresas.user_id = auth.uid()
    ));

-- Política para notas fiscais
CREATE POLICY "Usuários podem ver apenas notas fiscais de suas empresas"
    ON notas_fiscais FOR ALL
    USING (EXISTS (
        SELECT 1 FROM empresas
        WHERE empresas.id = notas_fiscais.empresa_id
        AND empresas.user_id = auth.uid()
    ));

-- Índices para melhor performance
CREATE INDEX idx_empresas_user_id ON empresas(user_id);
CREATE INDEX idx_enderecos_empresa_id ON enderecos(empresa_id);
CREATE INDEX idx_certificados_empresa_id ON certificados(empresa_id);
CREATE INDEX idx_certificados_status ON certificados(status);
CREATE INDEX idx_certificados_data_validade ON certificados(data_validade);
CREATE INDEX idx_notas_fiscais_empresa_id ON notas_fiscais(empresa_id);
CREATE INDEX idx_notas_fiscais_data_emissao ON notas_fiscais(data_emissao);
