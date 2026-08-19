import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formationsService, inscriptionsService } from '../services/api';
import type { Formation, Lecon } from '../types';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, ChevronDown, ChevronRight, Lock } from 'lucide-react';

export const FormationViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  
  // État pour savoir quelle leçon est actuellement active
  const [activeLecon, setActiveLecon] = useState<Lecon | null>(null);
  // Modules étendus
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  // Progression
  const [progressions, setProgressions] = useState<any[]>([]);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    formationsService.getFormations().then(formations => {
      const found = formations.find(f => f.slug === slug);
      if (found) {
        setFormation(found);
        // Ouvrir le premier module par défaut et sélectionner la première leçon
        if (found.modules && found.modules.length > 0) {
          setExpandedModules([found.modules[0].id]);
          if (found.modules[0].lecons && found.modules[0].lecons.length > 0) {
            setActiveLecon(found.modules[0].lecons[0]);
          }
        }
      }
    });

    inscriptionsService.getProgression().then(setProgressions);
  }, [slug]);

  const handleMarkAsCompleted = async () => {
    if (!activeLecon) return;
    setSavingProgress(true);
    const success = await inscriptionsService.saveProgression(activeLecon.id, 0, true);
    if (success) {
      setProgressions(prev => {
        const exists = prev.find(p => p.lecon_id === activeLecon.id);
        if (exists) return prev.map(p => p.lecon_id === activeLecon.id ? { ...p, terminee: true } : p);
        return [...prev, { lecon_id: activeLecon.id, terminee: true, derniere_position: 0 }];
      });
    }
    setSavingProgress(false);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  if (!formation) {
    return <div className="p-8 text-center text-text-muted">Chargement de la formation...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-4">
      {/* Header de la formation */}
      <div className="flex items-center gap-4 pb-4 border-b border-border mb-4">
        <button 
          onClick={() => navigate('/app/mes-formations')}
          className="p-2 hover:bg-background rounded-xl text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-primary">{formation.titre}</h1>
          <p className="text-sm text-text-muted">Progression enregistrée automatiquement</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Lecteur Vidéo (Zone principale) */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          
          {/* Bannière Présentiel */}
          {(formation.mode === 'mixte' || formation.mode === 'presentiel') && (
            <div className="bg-accent/10 border-b border-accent/20 p-4 flex items-center justify-between">
              <p className="text-sm text-primary font-medium">
                🏢 Cette formation est également disponible en <strong>présentiel</strong> dans nos locaux !
              </p>
              <button 
                onClick={() => window.open(`https://wa.me/237670865004?text=Bonjour, je souhaite suivre la formation ${formation.titre} en présentiel.`, '_blank')}
                className="px-4 py-1.5 bg-accent text-primary text-xs font-bold rounded-full hover:scale-105 transition-transform"
              >
                Réserver ma place
              </button>
            </div>
          )}

          {/* Espace réservé pour le lecteur vidéo */}
          <div className="w-full aspect-video bg-black flex flex-col items-center justify-center relative border-b border-border shrink-0">
            {activeLecon ? (
              activeLecon.type === 'video' ? (
                activeLecon.url_contenu ? (
                  <video 
                    controls
                    className="w-full h-full object-contain"
                    poster={formation?.image_couverture}
                    key={activeLecon.id}
                  >
                    <source src={activeLecon.url_contenu} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                  </video>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-primary shadow-lg cursor-pointer hover:scale-105 transition-transform mb-4">
                      <PlayCircle size={40} />
                    </div>
                    <p className="text-white font-medium">Lecteur Vidéo</p>
                    <p className="text-sm text-gray-400 mt-2">La vidéo sera connectée via un hébergeur externe.</p>
                  </>
                )
              ) : (
                <>
                  <FileText size={48} className="text-text-muted mb-4" />
                  <p className="text-primary font-medium">Document PDF (Espace réservé)</p>
                  <button className="mt-4 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">
                    Télécharger le document
                  </button>
                </>
              )
            ) : (
              <p className="text-text-muted">Sélectionnez une leçon dans le programme.</p>
            )}
          </div>

          {/* Informations sur la leçon active */}
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {activeLecon ? activeLecon.titre : "Bienvenue dans la formation"}
              </h2>
              {activeLecon && (
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={savingProgress || progressions.some(p => p.lecon_id === activeLecon.id && p.terminee)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    progressions.some(p => p.lecon_id === activeLecon.id && p.terminee)
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-accent text-primary hover:bg-accent/90'
                  }`}
                >
                  <CheckCircle size={16} />
                  {progressions.some(p => p.lecon_id === activeLecon.id && p.terminee) ? 'Terminée' : (savingProgress ? 'En cours...' : 'Marquer comme terminée')}
                </button>
              )}
            </div>
            <p className="text-text-muted text-sm mb-6">
              {activeLecon?.duree_minutes ? `Durée : ${activeLecon.duree_minutes} minutes` : 'Document à lire'}
            </p>
            
            <div className="prose prose-sm max-w-none text-text-main">
              <p>
                Bienvenue dans cette session. Cette architecture est prête à accueillir votre contenu réel (vidéos hébergées sur Vimeo/YouTube/AWS, documents PDF stockés, etc.).
              </p>
              <p>
                Utilisez le menu latéral pour naviguer entre les différents modules et chapitres de la formation.
              </p>
            </div>
          </div>
        </div>

        {/* Programme (Barre latérale) */}
        <div className="w-full lg:w-96 flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm shrink-0">
          <div className="p-4 border-b border-border bg-background/50 font-bold text-primary">
            Programme du cours
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {formation.modules && formation.modules.length > 0 ? (
              [...formation.modules].sort((a, b) => a.ordre - b.ordre).map(module => (
                <div key={module.id} className="border-b border-border last:border-0">
                  {/* Entête du module */}
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 bg-background/30 hover:bg-background/80 transition-colors text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-primary text-sm">Module {module.ordre}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{module.titre}</p>
                    </div>
                    {expandedModules.includes(module.id) ? (
                      <ChevronDown size={18} className="text-text-muted" />
                    ) : (
                      <ChevronRight size={18} className="text-text-muted" />
                    )}
                  </button>

                  {/* Leçons du module */}
                  {expandedModules.includes(module.id) && (
                    <div className="flex flex-col py-2">
                      {module.lecons.map((lecon, idx) => {
                        const isActive = activeLecon?.id === lecon.id;
                        return (
                          <button
                            key={lecon.id}
                            onClick={() => setActiveLecon(lecon)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                              isActive ? 'bg-primary/5 border-l-4 border-accent pl-3' : 'hover:bg-background border-l-4 border-transparent pl-4'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {lecon.type === 'video' ? (
                                <PlayCircle size={16} className={isActive ? 'text-accent' : 'text-text-muted'} />
                              ) : (
                                <FileText size={16} className={isActive ? 'text-accent' : 'text-text-muted'} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${isActive ? 'font-semibold text-primary' : 'text-text-main'}`}>
                                {idx + 1}. {lecon.titre}
                              </p>
                              {lecon.duree_minutes && (
                                <p className="text-xs text-text-muted mt-1">{lecon.duree_minutes} min</p>
                              )}
                            </div>
                            <CheckCircle size={14} className={`${progressions.some(p => p.lecon_id === lecon.id && p.terminee) ? 'text-green-500' : 'text-border'} shrink-0 mt-1`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-text-muted text-sm flex flex-col items-center justify-center h-full">
                <Lock size={48} className="text-accent mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Contenu verrouillé</h3>
                <p className="mb-8 max-w-xs">Vous devez procéder au paiement pour débloquer l'accès à cette formation.</p>
                
                {formation.lien_paiement ? (
                  <button 
                    onClick={() => window.open(formation.lien_paiement, '_blank')}
                    className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                  >
                    <Lock size={18} /> Payer et Débloquer
                  </button>
                ) : (
                  <button 
                    onClick={() => window.open(`https://wa.me/237670865004?text=Bonjour, j'aimerais payer pour débloquer la formation : ${formation.titre}`, '_blank')}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                  >
                    Payer via WhatsApp
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
