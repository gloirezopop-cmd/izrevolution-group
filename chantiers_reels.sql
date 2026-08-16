-- =================================================================
-- INSERTION DES VRAIS CHANTIERS RÉVOLUTION GROUP
-- =================================================================

INSERT INTO public.chantiers (titre, description, categorie, localisation, statut, progression, image_principale, galerie_images, infos_projet)
VALUES 
(
  'Complexe Résidentiel Moderne', 
  'Conception 3D d''un immeuble résidentiel à plusieurs étages avec balcons en verre, parking au rez-de-chaussée et finitions modernes.', 
  'architecture', 
  'Cameroun', 
  'en_etude', 
  10, 
  '/images/chantiers/complexe_residentiel.jpg', 
  ARRAY[]::text[],
  '{"client_nom": "Projet Interne", "budget_fcfa": 0, "surface_m2": 1200}'::jsonb
),
(
  'Construction d''un immeuble (Gros Œuvre)', 
  'Suivi de chantier : élévation des murs en parpaings et préparation des planchers. Phase de gros œuvre.', 
  'btp', 
  'Cameroun', 
  'en_cours', 
  45, 
  '/images/chantiers/chantier_gros_oeuvre.jpg', 
  ARRAY[]::text[],
  '{"client_nom": "Client Confidentiel", "budget_fcfa": 0, "surface_m2": 0}'::jsonb
),
(
  'Villa Contemporaine', 
  'Modélisation 3D (3D MAX) d''une villa contemporaine avec détails architecturaux rouges, grande baie vitrée et aménagement extérieur.', 
  'architecture', 
  'Cameroun', 
  'en_etude', 
  100, 
  '/images/chantiers/villa_moderne_rouge.jpg', 
  ARRAY[]::text[],
  '{"client_nom": "Client Privé", "budget_fcfa": 0, "surface_m2": 350}'::jsonb
),
(
  'Réalisation d''une Charpente en Bois', 
  'Travaux de charpenterie : pose de la structure en bois pour la toiture d''une résidence privée en zone rurale.', 
  'btp', 
  'Cameroun', 
  'en_cours', 
  60, 
  '/images/chantiers/charpente_bois.jpg', 
  ARRAY[]::text[],
  '{"client_nom": "Client Privé", "budget_fcfa": 0, "surface_m2": 0}'::jsonb
);
