-- 1. FONCTION DE SÉCURITÉ POUR ÉVITER LES BUGS (Boucles infinies)
CREATE OR REPLACE FUNCTION public.est_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role IN ('admin', 'equipe');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. FORCER TOUS LES UTILISATEURS EXISTANTS À ÊTRE ADMINISTRATEURS (Très important !)
INSERT INTO public.profiles (id, nom, role)
SELECT id, email, 'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 3. REPARER LA LECTURE DES PROFILS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. REPARER LES POLITIQUES DES CHANTIERS, FORMATIONS, DEVIS, CONTACTS
DROP POLICY IF EXISTS "Modifications chantiers par admins" ON public.chantiers;
CREATE POLICY "Modifications chantiers par admins" ON public.chantiers FOR ALL USING (public.est_admin());

DROP POLICY IF EXISTS "Modifications formations par admins" ON public.formations;
CREATE POLICY "Modifications formations par admins" ON public.formations FOR ALL USING (public.est_admin());

DROP POLICY IF EXISTS "Seuls les admins voient les devis" ON public.devis;
CREATE POLICY "Seuls les admins voient les devis" ON public.devis FOR SELECT USING (public.est_admin());

DROP POLICY IF EXISTS "Les admins peuvent modifier les devis" ON public.devis;
CREATE POLICY "Les admins peuvent modifier les devis" ON public.devis FOR UPDATE USING (public.est_admin());

DROP POLICY IF EXISTS "Admins voient les contacts" ON public.contacts;
CREATE POLICY "Admins voient les contacts" ON public.contacts FOR SELECT USING (public.est_admin());

-- 5. REPARER LES POLITIQUES DES MODULES, LECONS, DOCUMENTS, PARAMETRES
DROP POLICY IF EXISTS "Modifications modules par admins" ON public.modules;
CREATE POLICY "Modifications modules par admins" ON public.modules FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

DROP POLICY IF EXISTS "Modifications lecons par admins" ON public.lecons;
CREATE POLICY "Modifications lecons par admins" ON public.lecons FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

DROP POLICY IF EXISTS "Modifications documents par admins" ON public.documents;
CREATE POLICY "Modifications documents par admins" ON public.documents FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

DROP POLICY IF EXISTS "Modifications parametres par admins" ON public.parametres_entreprise;
CREATE POLICY "Modifications parametres par admins" ON public.parametres_entreprise FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());
