-- 1. Forcer tous les utilisateurs existants à devenir Administrateur
INSERT INTO public.profiles (id, nom, role)
SELECT id, email, 'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'admin';
