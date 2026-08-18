-- 1. Ajouter les colonnes manquantes à la table formations pour qu'elle corresponde au code du site
ALTER TABLE public.formations 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS logiciel TEXT,
ADD COLUMN IF NOT EXISTS duree_h NUMERIC,
ADD COLUMN IF NOT EXISTS prix_fcfa NUMERIC,
ADD COLUMN IF NOT EXISTS mode TEXT,
ADD COLUMN IF NOT EXISTS est_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS image_couverture TEXT;

-- 2. Ajouter la formation ArchiCAD
INSERT INTO public.formations (
  id, titre, slug, logiciel, description, niveau, duree_h, prix, prix_fcfa, mode, est_public, image_couverture, statut
) VALUES (
  uuid_generate_v4(),
  'Maîtrise d''ArchiCAD 26',
  'archicad-26-maitrise',
  'ArchiCAD',
  'Apprenez à modéliser des bâtiments en 3D et à générer des plans 2D complets avec ArchiCAD. Formation orientée BIM.',
  'debutant',
  40,
  150,
  100000,
  'mixte',
  true,
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
  'publie'
);

-- 3. Ajouter la formation Robot Structural Analysis
INSERT INTO public.formations (
  id, titre, slug, logiciel, description, niveau, duree_h, prix, prix_fcfa, mode, est_public, image_couverture, statut
) VALUES (
  uuid_generate_v4(),
  'Calcul de Structures avec Robot Structural',
  'robot-structural-calcul',
  'Robot',
  'Formation avancée sur le dimensionnement et l''analyse des structures en béton armé et charpente métallique.',
  'avance',
  60,
  200,
  130000,
  'en_ligne',
  true,
  'https://images.unsplash.com/photo-1541888087425-ce81dfc46928?auto=format&fit=crop&q=80&w=800',
  'publie'
);
