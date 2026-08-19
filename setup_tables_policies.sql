-- Politiques pour la table modules
DROP POLICY IF EXISTS "Modifications modules par admins" ON public.modules;
CREATE POLICY "Modifications modules par admins" ON public.modules 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Politiques pour la table lecons
DROP POLICY IF EXISTS "Modifications lecons par admins" ON public.lecons;
CREATE POLICY "Modifications lecons par admins" ON public.lecons 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Politiques pour la table documents
DROP POLICY IF EXISTS "Modifications documents par admins" ON public.documents;
CREATE POLICY "Modifications documents par admins" ON public.documents 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Politiques pour la table parametres_entreprise
DROP POLICY IF EXISTS "Modifications parametres par admins" ON public.parametres_entreprise;
CREATE POLICY "Modifications parametres par admins" ON public.parametres_entreprise 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);
