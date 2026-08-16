-- =======================================================
-- INITIALISATION DE LA BASE DE DONNÉES RÉVOLUTION GROUP
-- =======================================================

-- 1. CRÉATION DES TABLES

-- Table Profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    telephone TEXT,
    photo TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'equipe', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Chantiers
CREATE TABLE public.chantiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre TEXT NOT NULL,
    description TEXT,
    categorie TEXT CHECK (categorie IN ('architecture', 'btp', 'etude')),
    localisation TEXT,
    image_principale TEXT,
    galerie_images TEXT[],
    statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'livre', 'en_etude')),
    progression INTEGER DEFAULT 0,
    date_realisation DATE,
    infos_projet JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Devis
CREATE TABLE public.devis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.profiles(id),
    nom_client TEXT NOT NULL,
    telephone TEXT NOT NULL,
    email TEXT,
    localisation TEXT,
    type_projet TEXT,
    description TEXT,
    pieces_jointes TEXT[],
    statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_etude', 'accepte', 'refuse')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Formations
CREATE TABLE public.formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre TEXT NOT NULL,
    description TEXT,
    image TEXT,
    categorie TEXT,
    niveau TEXT,
    formateur TEXT,
    prix NUMERIC,
    statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Modules
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    ordre INTEGER NOT NULL
);

-- Table Leçons
CREATE TABLE public.lecons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    duree INTEGER,
    ordre INTEGER NOT NULL
);

-- Table Documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    fichier_url TEXT NOT NULL,
    type_document TEXT CHECK (type_document IN ('pdf', 'excel', 'dwg'))
);

-- Table Contacts
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    email TEXT,
    sujet TEXT,
    message TEXT NOT NULL,
    statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'traite')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table Paramètres
CREATE TABLE public.parametres_entreprise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_officiel TEXT DEFAULT 'REVOLUTION GROUP',
    logo_url TEXT,
    description TEXT,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    ville TEXT,
    pays TEXT,
    reseaux_sociaux JSONB DEFAULT '{}'::jsonb,
    CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid) -- Force une seule ligne possible
);

-- =======================================================
-- 2. POLITIQUES DE SÉCURITÉ (Row Level Security)
-- =======================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametres_entreprise ENABLE ROW LEVEL SECURITY;

-- Chantiers : Tout le monde peut voir, seuls les admins peuvent modifier
CREATE POLICY "Chantiers visibles par tous" ON public.chantiers FOR SELECT USING (true);
CREATE POLICY "Modifications chantiers par admins" ON public.chantiers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);

-- Formations : Tout le monde peut voir si 'publie'
CREATE POLICY "Formations publiées visibles par tous" ON public.formations FOR SELECT USING (statut = 'publie');
CREATE POLICY "Modifications formations par admins" ON public.formations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);

-- Devis : Tout le monde peut insérer, seuls les admins peuvent lire/modifier
CREATE POLICY "Tout le monde peut demander un devis" ON public.devis FOR INSERT WITH CHECK (true);
CREATE POLICY "Seuls les admins voient les devis" ON public.devis FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);
CREATE POLICY "Les admins peuvent modifier les devis" ON public.devis FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);

-- Contacts : Pareil que les devis
CREATE POLICY "Tout le monde peut envoyer un message" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins voient les contacts" ON public.contacts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'equipe'))
);

-- =======================================================
-- 3. CRÉATION DES BUCKETS DE STOCKAGE
-- =======================================================
-- Remarque : Ceci crée les buckets si la fonctionnalité Storage est activée
insert into storage.buckets (id, name, public) values ('chantiers', 'chantiers', true);
insert into storage.buckets (id, name, public) values ('formations', 'formations', true);
insert into storage.buckets (id, name, public) values ('devis', 'devis', false);
insert into storage.buckets (id, name, public) values ('ressources', 'ressources', false);
