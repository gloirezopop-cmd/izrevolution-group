-- 1. Forcer la création des buckets s'ils n'existent pas
INSERT INTO storage.buckets (id, name, public) VALUES ('chantiers', 'chantiers', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('formations', 'formations', true) ON CONFLICT (id) DO NOTHING;

-- 2. Activer RLS sur storage.objects (sécurité des fichiers)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Nettoyer les anciennes politiques de stockage
DROP POLICY IF EXISTS "Lecture publique des chantiers" ON storage.objects;
DROP POLICY IF EXISTS "Lecture publique des formations" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent uploader (chantiers)" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent uploader (formations)" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent modifier (chantiers)" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent modifier (formations)" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent supprimer (chantiers)" ON storage.objects;
DROP POLICY IF EXISTS "Admins peuvent supprimer (formations)" ON storage.objects;

-- 4. Créer les politiques de LECTURE pour tout le monde (Public)
CREATE POLICY "Lecture publique des chantiers" ON storage.objects
FOR SELECT USING (bucket_id = 'chantiers');

CREATE POLICY "Lecture publique des formations" ON storage.objects
FOR SELECT USING (bucket_id = 'formations');

-- 5. Créer les politiques d'ÉCRITURE pour les Admins (Upload, Update, Delete)
CREATE POLICY "Admins peuvent uploader (chantiers)" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'chantiers' AND public.est_admin());

CREATE POLICY "Admins peuvent uploader (formations)" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'formations' AND public.est_admin());

CREATE POLICY "Admins peuvent modifier (chantiers)" ON storage.objects
FOR UPDATE USING (bucket_id = 'chantiers' AND public.est_admin());

CREATE POLICY "Admins peuvent modifier (formations)" ON storage.objects
FOR UPDATE USING (bucket_id = 'formations' AND public.est_admin());

CREATE POLICY "Admins peuvent supprimer (chantiers)" ON storage.objects
FOR DELETE USING (bucket_id = 'chantiers' AND public.est_admin());

CREATE POLICY "Admins peuvent supprimer (formations)" ON storage.objects
FOR DELETE USING (bucket_id = 'formations' AND public.est_admin());
