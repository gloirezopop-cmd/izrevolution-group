-- Ajout des colonnes pour les liens de paiement et les messages d'urgence
ALTER TABLE formations 
ADD COLUMN IF NOT EXISTS lien_paiement TEXT,
ADD COLUMN IF NOT EXISTS message_urgence TEXT;
