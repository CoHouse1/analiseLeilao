-- Script para atualizar os créditos de usuários existentes
UPDATE public.user_credits
SET free_credits = 50
WHERE free_credits < 50;

-- Registrar a transação para usuários que tiveram seus créditos atualizados
INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
SELECT user_id, 50 - free_credits, 'bonus', 'Ajuste de créditos iniciais para 50'
FROM public.user_credits
WHERE free_credits < 50;
