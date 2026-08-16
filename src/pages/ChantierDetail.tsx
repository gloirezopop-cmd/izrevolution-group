import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projetsService } from '../services/api';
import type { Projet } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, MapPin, Calendar, Maximize, User, Building, Info } from 'lucide-react';

export const ChantierDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [projet, setProjet] = useState<Projet | null>(null);

  useEffect(() => {
    // Dans une vraie API, on ferait un getProjetBySlug
    projetsService.getProjets().then(projets => {
      const found = projets.find(p => p.slug === slug);
      if (found) setProjet(found);
    });
  }, [slug]);

  if (!projet) {
    return <div className="p-8 text-center text-text-muted">Chargement du projet...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Bouton de retour */}
      <button 
        onClick={() => navigate('/app/chantiers')}
        className="flex items-center gap-2 text-text-muted hover:text-primary font-medium w-fit transition-colors"
      >
        <ArrowLeft size={20} />
        Retour aux chantiers
      </button>

      {/* Entête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              projet.statut === 'en_cours' ? 'bg-primary/10 text-primary' : 
              projet.statut === 'livre' ? 'bg-green-100 text-green-700' : 
              'bg-border text-text-muted'
            }`}>
              {projet.statut.replace('_', ' ')}
            </span>
            <span className="text-sm font-medium text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Building size={14} /> {projet.type}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-primary">{projet.titre}</h1>
        </div>
        <Button onClick={() => navigate('/app/devis')} variant="primary" className="whitespace-nowrap">
          NOUS CONFIER VOTRE PROJET
        </Button>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-primary-light/10 relative">
        {projet.photo_couverture ? (
          <img src={projet.photo_couverture} alt={projet.titre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/20">
            <Building size={64} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4">
              <Info size={24} className="text-accent" /> Description du projet
            </h2>
            <div className="prose prose-sm max-w-none text-text-main leading-relaxed">
              {projet.description ? (
                <p>{projet.description}</p>
              ) : (
                <p className="text-text-muted italic">Les détails complets de cette réalisation ne sont pas encore disponibles.</p>
              )}
            </div>

            {projet.prestations && projet.prestations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white mb-3">Prestations réalisées</h3>
                <div className="flex flex-wrap gap-2">
                  {projet.prestations.map((p, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary-light rounded-full text-sm font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Galerie d'images secondaires */}
          {projet.images_secondaires && projet.images_secondaires.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {projet.images_secondaires.map((img, idx) => (
                <div key={idx} className="h-48 rounded-xl overflow-hidden bg-primary-light/10">
                  <img src={img} alt={`${projet.titre} vue ${idx+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barre Latérale (Métadonnées) */}
        <div className="flex flex-col gap-6">
          <Card className="bg-primary text-white border-none shadow-xl">
            <h3 className="text-lg font-semibold mb-6 text-accent">Détails de l'ouvrage</h3>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-accent mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Localisation</p>
                  <p className="font-medium">{projet.ville}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="text-accent mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Maître d'ouvrage</p>
                  <p className="font-medium">{projet.client_nom}</p>
                </div>
              </div>

              {projet.annee_realisation && (
                <div className="flex items-start gap-3">
                  <Calendar className="text-accent mt-0.5" size={20} />
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Période</p>
                    <p className="font-medium">{projet.annee_realisation}</p>
                  </div>
                </div>
              )}

              {projet.surface_m2 && (
                <div className="flex items-start gap-3">
                  <Maximize className="text-accent mt-0.5" size={20} />
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">Surface</p>
                    <p className="font-medium">{projet.surface_m2} m²</p>
                  </div>
                </div>
              )}
            </div>

            {projet.statut === 'en_cours' && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-white/80">Avancement des travaux</span>
                  <span className="text-accent font-bold">{projet.avancement_pct}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${projet.avancement_pct}%` }} />
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-white/80 mb-4">Vous avez un projet similaire ?</p>
              <Button onClick={() => window.open(`https://wa.me/237670865004?text=Bonjour, je vous contacte suite à la découverte de votre projet : ${projet.titre}`, '_blank')} variant="outline" className="w-full bg-transparent border-accent text-accent hover:bg-accent hover:text-primary">
                NOUS CONTACTER SUR WHATSAPP
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
