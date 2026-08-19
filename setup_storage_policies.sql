-- Activer RLS sur storage.objects

-- Politique pour permettre à tout le monde de lire les fichiers publics (chantiers, formations)
CREATE POLICY "Lecture publique des chantiers" ON storage.objects
FOR SELECT USING (bucket_id = 'chantiers');

CREATE POLICY "Lecture publique des formations" ON storage.objects
FOR SELECT USING (bucket_id = 'formations');

-- Politique pour permettre aux admins d'insérer, mettre à jour et supprimer des fichiers
CREATE POLICY "Admins peuvent uploader (chantiers)" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'chantiers' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins peuvent uploader (formations)" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'formations' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins peuvent modifier (chantiers)" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'chantiers' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins peuvent modifier (formations)" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'formations' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins peuvent supprimer (chantiers)" ON storage.objects
FOR DELETE USING (
    bucket_id = 'chantiers' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins peuvent supprimer (formations)" ON storage.objects
FOR DELETE USING (
    bucket_id = 'formations' 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);
