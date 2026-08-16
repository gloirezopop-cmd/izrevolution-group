-- =================================================================
-- ÉTAPE 1 : SUIVI DE PROGRESSION DES ÉLÈVES
-- =================================================================

CREATE TABLE IF NOT EXISTS public.progression_lecons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES auth.users(id) NOT NULL,
    lecon_id UUID REFERENCES public.lecons(id) NOT NULL,
    terminee BOOLEAN DEFAULT false,
    derniere_lecture TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(utilisateur_id, lecon_id)
);

ALTER TABLE public.progression_lecons ENABLE ROW LEVEL SECURITY;

-- Politiques : Les utilisateurs peuvent gérer leur propre progression
CREATE POLICY "Les utilisateurs voient leur progression" ON public.progression_lecons FOR SELECT USING (
  utilisateur_id = auth.uid()
);

CREATE POLICY "Les utilisateurs insèrent leur progression" ON public.progression_lecons FOR INSERT WITH CHECK (
  utilisateur_id = auth.uid()
);

CREATE POLICY "Les utilisateurs mettent à jour leur progression" ON public.progression_lecons FOR UPDATE USING (
  utilisateur_id = auth.uid()
);
