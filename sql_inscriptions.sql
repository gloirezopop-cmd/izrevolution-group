-- =================================================================
-- ARCHITECTURE DES INSCRIPTIONS ET SÉCURITÉ VIDÉO
-- =================================================================

-- 1. Création de la table des inscriptions
CREATE TABLE public.inscriptions_formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES auth.users(id) NOT NULL,
    formation_id UUID REFERENCES public.formations(id) NOT NULL,
    statut_inscription TEXT DEFAULT 'en_attente' CHECK (statut_inscription IN ('en_attente', 'active', 'annulee')),
    statut_paiement TEXT DEFAULT 'non_paye' CHECK (statut_paiement IN ('non_paye', 'en_attente', 'paye')),
    acces_autorise BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(utilisateur_id, formation_id)
);

-- 2. Activation de la sécurité RLS
ALTER TABLE public.inscriptions_formations ENABLE ROW LEVEL SECURITY;

-- 3. Politiques pour les inscriptions
-- Les admins voient tout
CREATE POLICY "Les admins voient toutes les inscriptions" ON public.inscriptions_formations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);
-- Les utilisateurs voient et créent leurs propres inscriptions
CREATE POLICY "Les utilisateurs voient leurs inscriptions" ON public.inscriptions_formations FOR SELECT USING (
  utilisateur_id = auth.uid()
);
CREATE POLICY "Les utilisateurs peuvent s'inscrire" ON public.inscriptions_formations FOR INSERT WITH CHECK (
  utilisateur_id = auth.uid()
);

-- 4. Politiques STRICTES pour les Leçons (Vidéos) et Documents
-- Seuls les admins et les utilisateurs inscrits ET autorisés peuvent voir les leçons
DROP POLICY IF EXISTS "Leçons visibles" ON public.lecons;
CREATE POLICY "Accès restreint aux leçons" ON public.lecons FOR SELECT USING (
  -- L'utilisateur est admin
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
  OR
  -- Ou l'utilisateur est inscrit à cette formation et l'accès est autorisé
  EXISTS (
    SELECT 1 FROM public.inscriptions_formations inf
    JOIN public.modules mod ON mod.formation_id = inf.formation_id
    WHERE inf.utilisateur_id = auth.uid() 
      AND inf.acces_autorise = true 
      AND mod.id = lecons.module_id
  )
);

-- Même chose pour les documents
DROP POLICY IF EXISTS "Documents visibles" ON public.documents;
CREATE POLICY "Accès restreint aux documents" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
  OR
  EXISTS (
    SELECT 1 FROM public.inscriptions_formations inf
    WHERE inf.utilisateur_id = auth.uid() 
      AND inf.acces_autorise = true 
      AND inf.formation_id = documents.formation_id
  )
);
