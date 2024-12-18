-- Criar tabela de notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs do webhook
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at em notifications
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_webhook_logs_event ON webhook_logs(event);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Políticas de segurança (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política para notificações
CREATE POLICY "Usuários podem ver apenas suas próprias notificações"
    ON notifications FOR ALL
    USING (auth.uid() = user_id);

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET read = true
    WHERE id = notification_id
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar notificações não lidas
CREATE OR REPLACE FUNCTION get_unread_notifications()
RETURNS SETOF notifications AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM notifications
    WHERE user_id = auth.uid()
    AND read = false
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON TABLE notifications IS 'Notificações do sistema para os usuários';
COMMENT ON TABLE webhook_logs IS 'Logs dos eventos recebidos via webhook';
COMMENT ON FUNCTION mark_notification_as_read IS 'Marca uma notificação específica como lida';
COMMENT ON FUNCTION get_unread_notifications IS 'Retorna todas as notificações não lidas do usuário atual';
