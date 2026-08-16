-- =================================================================
-- MISE À JOUR : TABLE FORMATIONS
-- Ajout des colonnes pour la gestion précise des formations.
-- =================================================================

-- 1. Ajout de la durée (en heures) et du mode (présentiel, en ligne, mixte)
ALTER TABLE public.formations
ADD COLUMN IF NOT EXISTS duree_h INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'mixte' CHECK (mode IN ('presentiel', 'en_ligne', 'mixte'));

-- 2. Mise à jour de nos 4 formations de test avec de fausses durées
-- (Ces durées existaient dans vos mocks d'origine)
UPDATE public.formations SET duree_h = 40, mode = 'mixte' WHERE titre = 'Maîtrise de AutoCAD';
UPDATE public.formations SET duree_h = 60, mode = 'en_ligne' WHERE titre = 'Modélisation avec ArchiCAD';
UPDATE public.formations SET duree_h = 50, mode = 'presentiel' WHERE titre = 'Conception BIM avec Revit';
UPDATE public.formations SET duree_h = 80, mode = 'mixte' WHERE titre = 'Calcul de Structure (Robot)';
