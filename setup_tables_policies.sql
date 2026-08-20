-- 1. DROP EXISTING POLICIES TO AVOID ERRORS
DROP POLICY IF EXISTS "Modules visibles par tous" ON public.modules;
DROP POLICY IF EXISTS "Modifications modules par admins" ON public.modules;

DROP POLICY IF EXISTS "Leçons visibles par tous" ON public.lecons;
DROP POLICY IF EXISTS "Modifications lecons par admins" ON public.lecons;

DROP POLICY IF EXISTS "Documents chantiers visibles par admins" ON public.documents;
DROP POLICY IF EXISTS "Modifications documents par admins" ON public.documents;

DROP POLICY IF EXISTS "Paramètres visibles par tous" ON public.parametres_entreprise;
DROP POLICY IF EXISTS "Modifications parametres par admins" ON public.parametres_entreprise;

-- 2. CREATE POLICIES FOR 'modules'
CREATE POLICY "Modules visibles par tous" ON public.modules 
FOR SELECT USING (true);

CREATE POLICY "Modifications modules par admins" ON public.modules 
FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

-- 3. CREATE POLICIES FOR 'lecons'
CREATE POLICY "Leçons visibles par tous" ON public.lecons 
FOR SELECT USING (true);

CREATE POLICY "Modifications lecons par admins" ON public.lecons 
FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

-- 4. CREATE POLICIES FOR 'documents'
CREATE POLICY "Documents chantiers visibles par admins" ON public.documents 
FOR SELECT USING (public.est_admin());

CREATE POLICY "Modifications documents par admins" ON public.documents 
FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());

-- 5. CREATE POLICIES FOR 'parametres_entreprise'
CREATE POLICY "Paramètres visibles par tous" ON public.parametres_entreprise 
FOR SELECT USING (true);

CREATE POLICY "Modifications parametres par admins" ON public.parametres_entreprise 
FOR ALL USING (public.est_admin()) WITH CHECK (public.est_admin());
