-- =================================================================
-- INSERTION DES DONNÉES DE TEST (CHANTIERS & FORMATIONS)
-- Ce script peuple votre base de données avec vos réalisations.
-- =================================================================

-- 1. INSERTION DES CHANTIERS
INSERT INTO public.chantiers (titre, description, categorie, localisation, statut, progression, image_principale, galerie_images, infos_projet)
VALUES 
(
  'Villa Moderne', 
  'Construction d''une villa moderne avec finitions haut de gamme, piscine et domotique intégrée.', 
  'btp', 
  'Douala', 
  'en_cours', 
  35, 
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800', 
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'],
  '{"client_nom": "Jean Dupont", "budget_fcfa": 45000000, "surface_m2": 250, "annee": "2025-2026"}'::jsonb
),
(
  'Immeuble R+4', 
  'Immeuble commercial comprenant des bureaux, des espaces de coworking et un parking souterrain.', 
  'architecture', 
  'Yaoundé', 
  'en_etude', 
  0, 
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', 
  ARRAY[]::text[],
  '{"client_nom": "Marie Kamga", "budget_fcfa": 120000000, "surface_m2": 800, "annee": "2026"}'::jsonb
);

-- 2. INSERTION DES FORMATIONS
INSERT INTO public.formations (titre, description, image, categorie, niveau, formateur, prix, statut)
VALUES 
(
  'Maîtrise de AutoCAD', 
  'Apprenez à dessiner vos plans 2D.', 
  'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&q=80&w=800', 
  'AutoCAD', 
  'debutant', 
  'Raphael Gloire', 
  75000, 
  'publie'
),
(
  'Modélisation avec ArchiCAD', 
  'Conception 3D et BIM pour vos projets d''architecture.', 
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800', 
  'ArchiCAD', 
  'intermediaire', 
  'Raphael Gloire', 
  100000, 
  'publie'
),
(
  'Conception BIM avec Revit', 
  'Formation complète sur Autodesk Revit (Architecture & Structure). Venez en cabinet pour une pratique encadrée.', 
  'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=800', 
  'Revit', 
  'intermediaire', 
  'Raphael Gloire', 
  120000, 
  'publie'
),
(
  'Calcul de Structure (Robot)', 
  'Apprenez le dimensionnement et le calcul de structures en béton armé selon les normes (BAEL/RPA).', 
  'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800', 
  'Robot Structural Analysis', 
  'avance', 
  'Raphael Gloire', 
  150000, 
  'publie'
);
