import { supabase } from '../lib/supabase';
import type { Projet, Devis, Formation, Prospect } from '../types';

// Nous gardons les mocks pour Devis et Prospects temporairement
import { mockDevis, mockProspects } from '../data/mock';

export const projetsService = {
  async getProjets(): Promise<Projet[]> {
    const { data, error } = await supabase.from('chantiers').select('*');
    if (error) {
      console.error('Erreur Supabase getProjets:', error);
      return [];
    }
    
    // On mappe les colonnes Supabase vers l'interface Projet attendue par nos composants
    return data.map((row: any) => ({
      id: row.id,
      titre: row.titre,
      slug: row.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      client_nom: row.infos_projet?.client_nom || 'Client Anonyme',
      type: row.categorie || 'BTP',
      ville: row.localisation || 'Non spécifié',
      statut: row.statut,
      budget_fcfa: row.infos_projet?.budget_fcfa,
      avancement_pct: row.progression || 0,
      surface_m2: row.infos_projet?.surface_m2,
      description: row.description,
      est_public: row.publie ?? true,
      photo_couverture: row.image_principale,
      images_secondaires: row.galerie_images || [],
      annee_realisation: row.annee || row.date_realisation,
      prestations: row.prestations || []
    }));
  }
};

export const formationsService = {
  async getFormations(): Promise<Formation[]> {
    const { data, error } = await supabase.from('formations').select('*');
    if (error) {
      console.error('Erreur Supabase getFormations:', error);
      return [];
    }
    
    // On mappe les colonnes Supabase vers l'interface Formation
    return data.map((row: any) => ({
      id: row.id,
      titre: row.titre,
      slug: row.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      logiciel: row.categorie || '',
      duree_h: row.duree_h || 0,
      prix_fcfa: row.prix || 0,
      niveau: row.niveau || 'debutant',
      mode: row.mode || 'mixte',
      description: row.description || '',
      est_public: row.statut === 'publie',
      formateur: row.formateur || 'RÉVOLUTION GROUP',
      image_couverture: row.image,
      modules: [] // Pour la suite : nous ferons une requête jointe sur la table 'modules'
    }));
  }
};

export const inscriptionsService = {
  async sInscrire(formationId: string): Promise<{ success: boolean; message: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, message: 'Non connecté' };

    const { error } = await supabase.from('inscriptions_formations').insert({
      utilisateur_id: session.user.id,
      formation_id: formationId
    });

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'Vous êtes déjà inscrit à cette formation.' };
      }
      return { success: false, message: error.message };
    }
    
    return { success: true, message: 'Inscription réussie ! En attente de paiement.' };
  },

  async verifierAcces(formationId: string): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    // Check if admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    if (profile?.role === 'admin' || profile?.role === 'equipe') return true;

    // Check inscription status
    const { data, error } = await supabase.from('inscriptions_formations')
      .select('acces_autorise')
      .eq('utilisateur_id', session.user.id)
      .eq('formation_id', formationId)
      .single();
      
    if (error || !data) return false;
    return data.acces_autorise;
  },

  async getMesFormations(): Promise<any[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('inscriptions_formations')
      .select(`
        acces_autorise,
        statut_paiement,
        updated_at,
        derniere_lecon_id,
        formations (*)
      `)
      .eq('utilisateur_id', session.user.id);
      
    if (error || !data) return [];
    return data;
  },

  async getProgression(): Promise<any[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    
    const { data, error } = await supabase
      .from('progression_lecons')
      .select('*')
      .eq('utilisateur_id', session.user.id);
      
    if (error || !data) return [];
    return data;
  },

  async saveProgression(leconId: string, position: number, terminee: boolean): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase.from('progression_lecons').upsert({
      utilisateur_id: session.user.id,
      lecon_id: leconId,
      derniere_position: position,
      terminee: terminee,
      updated_at: new Date().toISOString()
    }, { onConflict: 'utilisateur_id, lecon_id' });
    
    // Mettre à jour la dernière leçon vue dans inscriptions_formations (besoin de formation_id)
    // On le fera séparément ou via un trigger, mais pour l'instant on se concentre sur progression_lecons
    return !error;
  }
};

export const devisService = {
  async getDevis(): Promise<Devis[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockDevis), 300));
  }
};

export const prospectsService = {
  async getProspects(): Promise<Prospect[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockProspects), 300));
  }
};
