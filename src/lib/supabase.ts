import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Variables d'environnement Supabase manquantes.\n" +
    "Veuillez créer un fichier .env à la racine du projet avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY."
  );
}

// Initialisation du client Supabase avec la clé anonyme (sécurisé pour le frontend)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
