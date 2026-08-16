import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { projetsService } from '../services/api';
import type { Projet } from '../types';
import { Building, MapPin, ArrowRight, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export const Chantiers = () => {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    projetsService.getProjets().then(data => {
      setProjets(data.filter(p => p.est_public));
      setLoading(false);
    });
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-8 max-w-7xl mx-auto">
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nos Chantiers & Réalisations</h1>
          <p className="text-text-muted mt-2 max-w-2xl">Découvrez les projets de construction et d'ingénierie menés par RÉVOLUTION GROUP. Notre expertise s'exprime à travers chaque réalisation.</p>
        </div>
        <Button onClick={() => navigate('/app/devis')} variant="primary" className="whitespace-nowrap shrink-0">
          NOUS CONFIER VOTRE PROJET
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projets.map((p) => (
          <motion.div key={p.id} variants={fadeInUp}>
            <Card onClick={() => navigate(`/chantiers/${p.slug}`)} className="p-0 overflow-hidden h-full flex flex-col group border-transparent hover:border-accent">
              {/* Image de couverture */}
              <div className="h-48 w-full relative bg-primary-light/5 overflow-hidden">
                {p.photo_couverture ? (
                  <img 
                    src={p.photo_couverture} 
                    alt={`Chantier ${p.titre}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                  <Camera size={48} />
                </div>
              )}
              {/* Statut Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                  p.statut === 'en_cours' ? 'bg-primary text-white' : 
                  p.statut === 'livre' ? 'bg-green-600 text-white' : 
                  'bg-white text-primary'
                }`}>
                  {p.statut.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                <Building size={14} />
                <span>{p.type}</span>
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">{p.titre}</h3>
              
              <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                <MapPin size={16} />
                <span>{p.ville}</span>
              </div>

              <p className="text-text-muted text-sm line-clamp-2 flex-1 mb-6">
                {p.description || "Aucune description disponible pour ce projet."}
              </p>

              {/* Progress if en_cours */}
              {p.statut === 'en_cours' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-text-muted">Avancement</span>
                    <span className="text-primary">{p.avancement_pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${p.avancement_pct}%` }} />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <span className="text-sm font-medium text-text-muted">
                  Client: <span className="text-primary">{p.client_nom}</span>
                </span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} />
                </span>
              </div>
            </div>
            </Card>
          </motion.div>
        ))}

        {loading && (
          <div className="col-span-full py-12 text-center text-text-muted">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Chargement des chantiers...
          </div>
        )}

        {!loading && projets.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted bg-card rounded-2xl border border-border">
            Aucun chantier n'est visible pour le moment.
          </div>
        )}
      </div>
    </motion.div>
  );
};
