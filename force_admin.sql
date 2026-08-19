-- 1. On s'assure que TOUS les utilisateurs existants ont un profil et qu'il est défini sur "admin"
INSERT INTO public.profiles (id, nom, role)
SELECT id, email, 'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'admin';
