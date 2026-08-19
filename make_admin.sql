-- Remplacez 'votre_email@gmail.com' par l'email exact que vous avez utilisé pour vous connecter sur le site
UPDATE profils 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'votre_email@gmail.com'
);
