import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatTile } from '../components/ui/StatTile';
import { Card } from '../components/ui/Card';
import { Building2, FileSignature, Users, PlayCircle, Lock, CheckCircle } from 'lucide-react';
import { inscriptionsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mesFormations, setMesFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      inscriptionsService.getMesFormations().then(data => {
        setMesFormations(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="text-white">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Bonjour, {user?.user_metadata?.prenom || 'Membre'}</h1>
        <p className="text-text-muted mt-2">Bienvenue sur votre espace d'apprentissage RÉVOLUTION GROUP.</p>
      </div>

      <h2 className="text-2xl font-bold text-primary mt-4 border-b border-border pb-2">Mes Formations</h2>

      {mesFormations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
            <PlayCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aucune formation en cours</h3>
          <p className="text-text-muted mb-6">Vous n'êtes inscrit à aucune formation pour le moment.</p>
          <Button onClick={() => navigate('/formations')} variant="primary">Parcourir les formations</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mesFormations.map((inscription) => {
            const f = inscription.formations;
            const isAuthorized = inscription.acces_autorise;
            
            return (
              <Card key={f.id} className="flex flex-col p-0 overflow-hidden border border-border/50">
                <div className="h-40 w-full relative bg-primary/20">
                  {f.image_couverture ? (
                    <img src={f.image_couverture} alt={f.titre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/40">Pas d'image</div>
                  )}
                  
                  {/* Overlay status */}
                  {!isAuthorized && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                      <Lock className="text-accent mb-2" size={32} />
                      <span className="text-white font-bold text-sm">Accès bloqué</span>
                      <span className="text-xs text-text-muted mt-1">
                        {inscription.statut_paiement === 'en_attente' ? 'Paiement en cours de validation' : 'Veuillez régler votre inscription'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{f.titre}</h3>
                  <p className="text-xs text-text-muted mb-4 line-clamp-2">{f.description}</p>
                  
                  {/* Barre de progression factice pour l'instant */}
                  {isAuthorized && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted">Progression</span>
                        <span className="text-accent font-mono">0%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-xs font-semibold px-2 py-1 bg-background rounded text-text-muted capitalize">
                      {f.mode.replace('_', ' ')}
                    </span>
                    
                    {isAuthorized ? (
                      <Button 
                        onClick={() => navigate(`/app/formations/${f.slug}`)}
                        variant="primary" 
                        className="text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <PlayCircle size={14} /> Reprendre
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        disabled
                        className="text-xs py-1.5 px-3 opacity-50"
                      >
                        En attente
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
