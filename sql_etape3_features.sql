-- =======================================================
-- ÉTAPE 3 : NOUVELLES FONCTIONNALITÉS
-- 1. Tracking de progression (Mes Formations)
-- 2. Mise à jour de la table chantiers (Portfolio)
-- =======================================================

-- =======================================================
-- 1. TRACKING DE PROGRESSION DES LEÇONS
-- =======================================================

CREATE TABLE public.progression_lecons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES auth.users(id) NOT NULL,
    lecon_id UUID REFERENCES public.lecons(id) NOT NULL,
    terminee BOOLEAN DEFAULT false,
    derniere_position INTEGER DEFAULT 0, -- en secondes
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(utilisateur_id, lecon_id)
);

ALTER TABLE public.progression_lecons ENABLE ROW LEVEL SECURITY;

-- Politiques pour progression_lecons
CREATE POLICY "Les utilisateurs voient leur propre progression" 
ON public.progression_lecons FOR SELECT 
USING (utilisateur_id = auth.uid());

CREATE POLICY "Les utilisateurs modifient leur propre progression" 
ON public.progression_lecons FOR ALL 
USING (utilisateur_id = auth.uid());

-- Mise à jour de inscriptions_formations
ALTER TABLE public.inscriptions_formations
ADD COLUMN IF NOT EXISTS derniere_lecon_id UUID REFERENCES public.lecons(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- =======================================================
-- 2. MISE À JOUR DE LA TABLE CHANTIERS
-- =======================================================

ALTER TABLE public.chantiers
ADD COLUMN IF NOT EXISTS date_debut DATE,
ADD COLUMN IF NOT EXISTS date_fin DATE,
ADD COLUMN IF NOT EXISTS annee INTEGER,
ADD COLUMN IF NOT EXISTS prestations TEXT[],
ADD COLUMN IF NOT EXISTS publie BOOLEAN DEFAULT false;

-- Mettre à jour les anciens chantiers pour qu'ils soient publiés par défaut si ce n'est pas déjà défini
UPDATE public.chantiers SET publie = true WHERE publie IS NULL;

-- Politique : ne voir que les chantiers publiés en mode public
DROP POLICY IF EXISTS "Chantiers visibles par tous" ON public.chantiers;
CREATE POLICY "Chantiers visibles par tous" ON public.chantiers 
FOR SELECT USING (
  publie = true 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);
