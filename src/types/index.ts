export type Role = 'admin' | 'staff';

export interface Profil {
  id: string;
  nom: string;
  role: Role;
  avatar_url?: string;
}

export type StatutProjet = 'etude' | 'en_cours' | 'en_pause' | 'livre';

export interface Projet {
  id: string;
  titre: string;
  slug: string;
  client_nom: string;
  type: string;
  ville: string;
  statut: StatutProjet;
  budget_fcfa?: number;
  date_debut?: string;
  date_fin_prevue?: string;
  avancement_pct: number;
  surface_m2?: number;
  description?: string;
  est_public: boolean;
  photo_couverture?: string;
  images_secondaires?: string[];
  annee_realisation?: string;
  prestations?: string[];
  publie?: boolean;
}

export type StatutDevis = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

export interface Devis {
  id: string;
  numero: string;
  projet_id?: string;
  client_nom: string;
  date: string;
  statut: StatutDevis;
  total_ht: number;
  tva_pct: number;
  total_ttc: number;
}

export interface DevisLigne {
  id: string;
  devis_id: string;
  designation: string;
  unite: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
  ordre: number;
}

export interface Lecon {
  id: string;
  titre: string;
  type: 'video' | 'pdf' | 'texte';
  duree_minutes?: number;
  url_contenu?: string;
}

export interface ModuleFormation {
  id: string;
  titre: string;
  ordre: number;
  lecons: Lecon[];
}

export interface Formation {
  id: string;
  titre: string;
  slug: string;
  logiciel: string;
  duree_h: number;
  prix_fcfa: number;
  niveau: 'debutant' | 'intermediaire' | 'avance';
  mode: 'presentiel' | 'en_ligne' | 'mixte';
  description: string;
  est_public: boolean;
  formateur?: string;
  image_couverture?: string;
  lien_paiement?: string;
  message_urgence?: string;
  modules?: ModuleFormation[];
}

export type StatutProspect = 'nouveau' | 'contacte' | 'converti' | 'perdu';

export interface Prospect {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  pays: string;
  motif: 'construction' | 'formation' | 'autre';
  message: string;
  statut: StatutProspect;
  source: string;
  cree_le: string;
}
