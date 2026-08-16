import type { Projet, Devis, Formation, Prospect } from '../../types';

export const mockProjets: Projet[] = [
  {
    id: 'p1',
    titre: 'Villa Moderne',
    slug: 'villa-moderne',
    client_nom: 'Jean Dupont',
    type: 'Résidentiel',
    ville: 'Douala',
    statut: 'en_cours',
    budget_fcfa: 45000000,
    avancement_pct: 35,
    surface_m2: 250,
    description: 'Construction d\'une villa moderne avec finitions haut de gamme, piscine et domotique intégrée.',
    est_public: true,
    photo_couverture: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    annee_realisation: '2025-2026',
    images_secondaires: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'p2',
    titre: 'Immeuble R+4',
    slug: 'immeuble-r4',
    client_nom: 'Marie Kamga',
    type: 'Commercial',
    ville: 'Yaoundé',
    statut: 'etude',
    budget_fcfa: 120000000,
    avancement_pct: 0,
    surface_m2: 800,
    description: 'Immeuble commercial comprenant des bureaux, des espaces de coworking et un parking souterrain.',
    est_public: false,
    photo_couverture: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    annee_realisation: '2026',
  }
];

export const mockDevis: Devis[] = [
  {
    id: 'd1',
    numero: 'DEV-2026-001',
    projet_id: 'p2',
    client_nom: 'Marie Kamga',
    date: '2026-08-10',
    statut: 'envoye',
    total_ht: 100628930,
    tva_pct: 19.25,
    total_ttc: 120000000,
  }
];

export const mockFormations: Formation[] = [
  {
    id: 'f1',
    titre: 'Maîtrise de AutoCAD',
    slug: 'maitrise-autocad',
    logiciel: 'AutoCAD',
    duree_h: 40,
    prix_fcfa: 75000,
    niveau: 'debutant',
    mode: 'mixte',
    description: 'Apprenez à dessiner vos plans 2D.',
    est_public: true,
    formateur: 'Raphael Gloire',
    image_couverture: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&q=80&w=800',
    modules: [
      {
        id: 'm1',
        titre: 'Introduction à l\'interface',
        ordre: 1,
        lecons: [
          { id: 'l1', titre: 'Découverte des outils', type: 'video', duree_minutes: 15, url_contenu: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l2', titre: 'Raccourcis clavier essentiels', type: 'pdf' }
        ]
      },
      {
        id: 'm2',
        titre: 'Les bases du dessin 2D',
        ordre: 2,
        lecons: [
          { id: 'l3', titre: 'Lignes, polylignes et cercles', type: 'video', duree_minutes: 25 }
        ]
      }
    ]
  },
  {
    id: 'f2',
    titre: 'Modélisation avec ArchiCAD',
    slug: 'modelisation-archicad',
    logiciel: 'ArchiCAD',
    duree_h: 60,
    prix_fcfa: 100000,
    niveau: 'intermediaire',
    mode: 'en_ligne',
    description: 'Conception 3D et BIM pour vos projets d\'architecture.',
    est_public: true,
    formateur: 'Raphael Gloire',
    image_couverture: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800',
    modules: [
      {
        id: 'm3',
        titre: 'Modélisation des murs',
        ordre: 1,
        lecons: [
          { id: 'l4', titre: 'Paramétrage des murs de base', type: 'video', duree_minutes: 20 }
        ]
      }
    ]
  },
  {
    id: 'f3',
    titre: 'Conception BIM avec Revit',
    slug: 'conception-bim-revit',
    logiciel: 'Revit',
    duree_h: 50,
    prix_fcfa: 120000,
    niveau: 'intermediaire',
    mode: 'presentiel',
    description: 'Formation complète sur Autodesk Revit (Architecture & Structure). Venez en cabinet pour une pratique encadrée.',
    est_public: true,
    formateur: 'Raphael Gloire',
    image_couverture: 'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'f4',
    titre: 'Calcul de Structure (Robot)',
    slug: 'calcul-structure-robot',
    logiciel: 'Robot Structural Analysis',
    duree_h: 80,
    prix_fcfa: 150000,
    niveau: 'avance',
    mode: 'mixte',
    description: 'Apprenez le dimensionnement et le calcul de structures en béton armé selon les normes (BAEL/RPA).',
    est_public: true,
    formateur: 'Raphael Gloire',
    image_couverture: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    modules: [
      {
        id: 'm4',
        titre: 'Introduction au BAEL',
        ordre: 1,
        lecons: [
          { id: 'l5', titre: 'Principe des États Limites', type: 'video', duree_minutes: 30 }
        ]
      }
    ]
  }
];

export const mockProspects: Prospect[] = [
  {
    id: 'pr1',
    nom: 'Paul Biya',
    telephone: '+237600000000',
    pays: 'Cameroun',
    motif: 'construction',
    message: 'Je souhaite construire une maison.',
    statut: 'nouveau',
    source: 'site_web',
    cree_le: '2026-08-14',
  }
];
