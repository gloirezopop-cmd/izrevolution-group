-- Ajouter la colonne notifications_email à la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notifications_email BOOLEAN DEFAULT true;
