import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { formationsService, inscriptionsService } from '../services/api';
import type { Formation } from '../types';
import { Clock, BarChart, BookOpen, PlayCircle, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';

export const Formations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    formationsService.getFormations().then(data => {
      setFormations(data);
      setLoading(false);
    });
  }, []);

  const formatCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
  };

  const handleInscription = async (formation: Formation) => {
    if (!user) {
      setSelectedFormationId(formation.id);
      setIsAuthModalOpen(true);
      return;
    }

    const res = await inscriptionsService.sInscrire(formation.id);
    setStatusMessage({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleAuthSuccess = async () => {
    if (selectedFormationId) {
      const res = await inscriptionsService.sInscrire(selectedFormationId);
      setStatusMessage({ type: res.success ? 'success' : 'error', text: res.message });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-8 max-w-7xl mx-auto">
        {statusMessage && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white font-medium ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {statusMessage.text}
          </div>
        )}
      <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-4">
        <h1 className="text-4xl font-bold text-primary mb-4">Masterclass BTP & Ingénierie</h1>
        <p className="text-text-muted text-lg">
          Développez vos compétences avec nos formations professionnelles sur les logiciels phares du génie civil (AutoCAD, ArchiCAD, Robot Structural Analysis, etc.).
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {formations.map(f => (
          <motion.div key={f.id} variants={fadeInUp} className="h-full">
            <Card onClick={() => navigate(`/formations/${f.slug}`)} className="flex flex-col p-0 h-full overflow-hidden group hover:shadow-xl transition-all duration-300 border-transparent hover:border-accent">
              {/* Couverture */}
            <div className="h-48 w-full relative bg-primary-light/10 overflow-hidden">
              {f.image_couverture ? (
                <img src={f.image_couverture} alt={f.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                  <BookOpen size={48} />
                </div>
              )}
              {/* Badge Logiciel */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-primary text-white backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  {f.logiciel}
                </span>
              </div>
              {/* Badge Mode */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                  f.mode === 'presentiel' ? 'bg-accent text-primary' :
                  f.mode === 'en_ligne' ? 'bg-green-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {f.mode === 'mixte' ? 'En ligne & Présentiel' : f.mode.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-primary leading-tight group-hover:text-accent transition-colors">{f.titre}</h3>
              </div>
              
              <p className="text-text-muted text-sm line-clamp-2 mb-6 flex-1">{f.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <Clock size={16} className="text-accent" />
                  <span>{f.duree_h} heures</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <BarChart size={16} className="text-accent" />
                  <span className="capitalize">{f.niveau}</span>
                </div>
              </div>

              {/* Formateur */}
              {f.formateur && (
                <div className="text-xs text-text-muted mb-4 pb-4 border-b border-border">
                  Par <span className="font-semibold text-primary">{f.formateur}</span>
                </div>
              )}

              {/* Action / Prix */}
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="font-mono font-bold text-lg text-primary">{formatCFA(f.prix_fcfa)}</span>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInscription(f);
                  }} 
                  variant="primary" 
                  className="flex items-center gap-2 text-sm px-4 py-2"
                >
                  <Lock size={16} /> S'inscrire
                </Button>
              </div>
            </div>
            </Card>
          </motion.div>
        ))}

        {loading && (
          <div className="col-span-full py-12 text-center text-text-muted">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Chargement des formations...
          </div>
        )}

        {!loading && formations.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted bg-card rounded-2xl border border-border">
            Aucune formation n'est disponible pour le moment.
          </div>
        )}
      </div>
    </motion.div>
    </>
  );
};
