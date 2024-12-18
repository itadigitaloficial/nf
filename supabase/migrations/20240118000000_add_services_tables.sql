-- Criar tabela de tipos de serviço
CREATE TABLE tipos_servico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias de serviço
CREATE TABLE categorias_servico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de serviços
CREATE TABLE servicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tipo_servico_id UUID NOT NULL REFERENCES tipos_servico(id),
    categoria_servico_id UUID NOT NULL REFERENCES categorias_servico(id),
    prazo_inicio INTEGER NOT NULL DEFAULT 0,
    prazo_entrega INTEGER NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_tipos_servico_updated_at
    BEFORE UPDATE ON tipos_servico
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_categorias_servico_updated_at
    BEFORE UPDATE ON categorias_servico
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at
    BEFORE UPDATE ON servicos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE tipos_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Usuários podem ver apenas seus tipos de serviço"
    ON tipos_servico FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver apenas suas categorias de serviço"
    ON categorias_servico FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver apenas seus serviços"
    ON servicos FOR ALL
    USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX idx_tipos_servico_user_id ON tipos_servico(user_id);
CREATE INDEX idx_categorias_servico_user_id ON categorias_servico(user_id);
CREATE INDEX idx_servicos_user_id ON servicos(user_id);
CREATE INDEX idx_servicos_tipo_servico_id ON servicos(tipo_servico_id);
CREATE INDEX idx_servicos_categoria_servico_id ON servicos(categoria_servico_id);
CREATE INDEX idx_servicos_status ON servicos(status);
