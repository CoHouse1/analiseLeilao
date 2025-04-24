-- Configuração do esquema de banco de dados para o AnaliseLeilão

-- Tabela de configurações do aplicativo
CREATE TABLE app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuário (estendendo a tabela auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de créditos dos usuários
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  free_credits INTEGER NOT NULL DEFAULT 50,
  paid_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de transações de créditos
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('use', 'purchase', 'refund', 'bonus')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações financeiras
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  credits_added INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de análises realizadas
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  tipo_imovel TEXT,
  matricula TEXT,
  estado TEXT,
  cidade TEXT,
  instrucoes TEXT,
  credits_used INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar os resultados das análises
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  result_data JSONB NOT NULL,
  html_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(analysis_id)
);

-- Inserir configurações iniciais do aplicativo
INSERT INTO app_config (key, value) VALUES 
('app_name', '"AnaliseLeilão"'),
('app_description', '"Análise detalhada de editais de leilões imobiliários para investimentos inteligentes"'),
('credit_cost', '1'),
('free_credits', '50'),
('contact_email', '"contato@analiseleilao.com.br"');

-- Criar funções e triggers

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp em profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para atualizar o timestamp em user_credits
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON user_credits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para atualizar o timestamp em transactions
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para atualizar o timestamp em app_config
CREATE TRIGGER update_app_config_updated_at
BEFORE UPDATE ON app_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para atualizar o timestamp em analyses
CREATE TRIGGER update_analyses_updated_at
BEFORE UPDATE ON analyses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Função para criar perfil de usuário automaticamente após o cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil para o novo usuário
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Adicionar créditos gratuitos iniciais
  INSERT INTO public.user_credits (user_id, free_credits)
  VALUES (NEW.id, 50);
  
  -- Registrar transação de créditos
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (NEW.id, 50, 'bonus', 'Créditos de boas-vindas');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil e créditos quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Função para usar créditos
CREATE OR REPLACE FUNCTION public.use_credits(user_uuid UUID, credits_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_free INTEGER;
  available_paid INTEGER;
  free_to_use INTEGER := 0;
  paid_to_use INTEGER := 0;
BEGIN
  -- Obter créditos disponíveis
  SELECT free_credits, paid_credits INTO available_free, available_paid
  FROM public.user_credits
  WHERE user_id = user_uuid;
  
  -- Verificar se há créditos suficientes
  IF (available_free + available_paid) < credits_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Calcular quantos créditos gratuitos e pagos serão usados
  IF available_free >= credits_amount THEN
    free_to_use := credits_amount;
  ELSE
    free_to_use := available_free;
    paid_to_use := credits_amount - available_free;
  END IF;
  
  -- Atualizar créditos
  UPDATE public.user_credits
  SET free_credits = free_credits - free_to_use,
      paid_credits = paid_credits - paid_to_use
  WHERE user_id = user_uuid;
  
  -- Registrar transação
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (user_uuid, credits_amount, 'use', 'Uso de créditos para análise');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar políticas de segurança (RLS)

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver apenas seus próprios perfis"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios perfis"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Políticas para user_credits
CREATE POLICY "Usuários podem ver apenas seus próprios créditos"
ON user_credits FOR SELECT
USING (auth.uid() = user_id);

-- Políticas para credit_transactions
CREATE POLICY "Usuários podem ver apenas suas próprias transações de créditos"
ON credit_transactions FOR SELECT
USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Usuários podem ver apenas suas próprias transações financeiras"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- Políticas para analyses
CREATE POLICY "Usuários podem ver apenas suas próprias análises"
ON analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias análises"
ON analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Políticas para analysis_results
CREATE POLICY "Usuários podem ver apenas os resultados de suas próprias análises"
ON analysis_results FOR SELECT
USING (EXISTS (
  SELECT 1 FROM analyses
  WHERE analyses.id = analysis_results.analysis_id
  AND analyses.user_id = auth.uid()
));

-- Política para app_config (leitura pública)
CREATE POLICY "Qualquer pessoa pode ler configurações do app"
ON app_config FOR SELECT
USING (true);