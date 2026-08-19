-- 1. Supprimer l'ancienne contrainte si elle existe (qui cause l'erreur)
ALTER TABLE public.inscriptions_formations 
DROP CONSTRAINT IF EXISTS inscriptions_formations_user_id_fkey;

ALTER TABLE public.inscriptions_formations 
DROP CONSTRAINT IF EXISTS inscriptions_formations_utilisateur_id_fkey;

-- 2. S'assurer que la colonne utilisateur_id existe et pointe vers auth.users
ALTER TABLE public.inscriptions_formations 
ADD CONSTRAINT inscriptions_formations_utilisateur_id_fkey 
FOREIGN KEY (utilisateur_id) REFERENCES auth.users(id) ON DELETE CASCADE;
