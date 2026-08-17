import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dsvtagextpgaxcriyhsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdnRhZ2V4dHBnYXhjcml5aHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODQyMjMsImV4cCI6MjEwMjM2MDIyM30.E3C-RHlt2Ys_BExE1LTcKQwpy_nci6vwMCt85pYxfNQ';

// Initialisation du client Supabase avec la clé anonyme (sécurisé pour le frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
