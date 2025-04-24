-- Criação da tabela de sessões de usuários
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  browser TEXT,
  device_type TEXT,
  is_current BOOLEAN DEFAULT FALSE
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_user_sessions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp em user_sessions
CREATE TRIGGER update_user_sessions_updated_at
BEFORE UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_sessions_timestamp();

-- Habilitar RLS para a tabela de sessões
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para user_sessions
CREATE POLICY "Usuários podem ver apenas suas próprias sessões"
ON user_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas suas próprias sessões"
ON user_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas suas próprias sessões"
ON user_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas suas próprias sessões"
ON user_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Índices para melhorar a performance
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);