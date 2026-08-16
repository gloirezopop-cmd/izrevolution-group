import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { inscriptionsService } from '../services/api';
import { PlayCircle, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const MesFormations = () => {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [progressions, setProgressions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // 1. Fetch inscriptions
    const insc = await inscriptionsService.getMesFormations();
    // Filter out unauthorized ones
    const autorisees = insc.filter(i => i.acces_autorise);
    
    // 2. Fetch all modules and lecons to calculate progress per formation
    // For a real app, we might want a backend RPC for this to avoid fetching everything
    const { data: mData } = await supabase.from('modules').select('formation_id, lecons(id)');
    
    // 3. Fetch user progression
    const prog = await inscriptionsService.getProgression();
    setProgressions(prog);

    // 4. Attach stats to inscriptions
    const enriched = autorisees.map(i => {
      const formId = i.formations.id;
      const formationModules = mData?.filter(m => m.formation_id === formId) || [];
      const totalLecons = formationModules.reduce((acc, m) => acc + (m.lecons?.length || 0), 0);
      
      const formLeconIds = formationModules.flatMap(m => m.lecons?.map((l: any) => l.id) || []);
      const completedLecons = prog.filter(p => formLeconIds.includes(p.lecon_id) && p.terminee).length;
      
      const percent = totalLecons > 0 ? Math.round((completedLecons / totalLecons) * 100) : 0;

      return {
        ...i,
        stats: {
          totalLecons,
          completedLecons,
          percent
        }
      };
    });

    setInscriptions(enriched);
    setLoading(false);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="p-8 text-white">Chargement de vos formations...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mes Formations</h1>
        <p className="text-text-muted">Retrouvez ici toutes les formations auxquelles vous avez accès, et reprenez là où vous en étiez.</p>
      </div>

      {inscriptions.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <BookOpen size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Aucune formation active</h2>
          <p className="text-text-muted mb-6">Vous n'avez accès à aucune formation pour le moment. Explorez notre catalogue !</p>
          <button onClick={() => navigate('/app/formations')} className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors">
            Voir le catalogue
          </button>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inscriptions.map((insc) => {
            const f = insc.formations;
            const stats = insc.stats;
            
            return (
              <motion.div key={f.id} variants={fadeInUp} className="h-full">
                <Card className="flex flex-col p-0 h-full overflow-hidden bg-surface hover:border-accent transition-all duration-300">
                  <div className="h-40 w-full relative bg-background">
                    {f.image ? (
                      <img src={f.image} alt={f.titre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20 bg-primary-light/10">
                        <BookOpen size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-primary text-white backdrop-blur-md rounded-full text-xs font-bold shadow-md">
                        {stats.percent}%
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{f.titre}</h3>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-background rounded-full h-2 mb-2 mt-4">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted mb-6">
                      <span>{stats.completedLecons} / {stats.totalLecons} leçons</span>
                      {insc.updated_at && (
                        <span>Dernière act. {new Date(insc.updated_at).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Clock size={16} className="text-accent" />
                        <span>{f.duree_h} heures</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex gap-3">
                      <button 
                        onClick={() => navigate(`/app/formations/${f.slug}`)} 
                        className="flex-1 py-2 bg-accent text-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
                      >
                        <PlayCircle size={18} /> Reprendre
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
