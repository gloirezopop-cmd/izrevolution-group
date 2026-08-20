-- CORRECTION POUR LES FORMATIONS
DROP POLICY IF EXISTS "Modifications formations par admins" ON public.formations;
CREATE POLICY "Modifications formations par admins" ON public.formations 
FOR ALL USING (public.est_admin());

-- CORRECTION POUR LES DEVIS
DROP POLICY IF EXISTS "Seuls les admins voient les devis" ON public.devis;
CREATE POLICY "Seuls les admins voient les devis" ON public.devis 
FOR SELECT USING (public.est_admin());

DROP POLICY IF EXISTS "Les admins peuvent modifier les devis" ON public.devis;
CREATE POLICY "Les admins peuvent modifier les devis" ON public.devis 
FOR UPDATE USING (public.est_admin());

-- CORRECTION POUR LES CONTACTS
DROP POLICY IF EXISTS "Admins voient les contacts" ON public.contacts;
CREATE POLICY "Admins voient les contacts" ON public.contacts 
FOR SELECT USING (public.est_admin());
