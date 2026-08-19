-- 1. Création de la table des invitations
CREATE TABLE IF NOT EXISTS public.admin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    invited_by UUID REFERENCES auth.users(id)
);

-- Activer RLS sur la table (optionnel mais recommandé)
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Les admins peuvent lire et insérer des invitations
CREATE POLICY "Les admins peuvent voir les invitations" ON public.admin_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Les admins peuvent créer des invitations" ON public.admin_invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Les admins peuvent supprimer des invitations" ON public.admin_invitations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 2. Mettre à jour la fonction de création de profil pour gérer les invitations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    is_invited BOOLEAN;
BEGIN
    -- Vérifier si l'email a été invité comme admin
    SELECT EXISTS(SELECT 1 FROM public.admin_invitations WHERE email = new.email) INTO is_invited;

    -- Créer le profil avec le rôle approprié
    INSERT INTO public.profiles (id, nom, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'nom', split_part(new.email, '@', 1)),
        CASE WHEN is_invited THEN 'admin' ELSE 'eleve' END
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Optionnel: on peut supprimer l'invitation pour qu'elle ne soit plus réutilisable
    IF is_invited THEN
        DELETE FROM public.admin_invitations WHERE email = new.email;
    END IF;

    RETURN new;
END;
$$;

-- 3. S'assurer que le trigger sur auth.users est actif
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
