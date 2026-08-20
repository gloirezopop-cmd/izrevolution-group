-- 1. Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Fonction sécurisée pour vérifier le rôle admin sans boucle infinie
CREATE OR REPLACE FUNCTION public.est_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role IN ('admin', 'equipe');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Supprimer les anciennes politiques pour tout nettoyer
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leur profil" ON public.profiles;
DROP POLICY IF EXISTS "Les administrateurs peuvent tout voir sur les profils" ON public.profiles;
DROP POLICY IF EXISTS "Les administrateurs peuvent tout voir" ON public.profiles;

-- 4. Créer les bonnes politiques pour 'profiles' SANS boucle infinie
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent insérer leur profil" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent tout voir sur les profils" ON public.profiles
FOR ALL USING (public.est_admin());

-- CORRECTION POUR LES CHANTIERS (qui ont été impactés)
DROP POLICY IF EXISTS "Modifications chantiers par admins" ON public.chantiers;
CREATE POLICY "Modifications chantiers par admins" ON public.chantiers 
FOR ALL USING (public.est_admin());
