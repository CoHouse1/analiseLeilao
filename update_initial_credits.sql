-- Atualizar a função que cria créditos iniciais para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_credits (user_id, free_credits, paid_credits)
    VALUES (NEW.id, 50, 0); -- Dar 50 créditos gratuitos para novos usuários
    
    INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
    VALUES (NEW.id, 50, 'bonus', 'Créditos de boas-vindas');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
