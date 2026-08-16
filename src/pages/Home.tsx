import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Building2, Compass, PenTool, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center bg-primary overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000" 
            alt="Construction BTP" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              L'excellence en ingénierie
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                Construisons <br/>
                <span className="text-accent">L'Avenir</span> Ensemble.
              </h1>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Construction • BTP • Études • Métré & Devis • Formation. <br/>
              RÉVOLUTION GROUP vous accompagne de la conception à la réalisation de vos projets les plus ambitieux.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/devis')} variant="primary" className="px-8 py-4 text-base font-bold shadow-xl shadow-accent/20">
                Demander un devis
              </Button>
              <Button onClick={() => navigate('/chantiers')} variant="outline" className="px-8 py-4 text-base font-bold bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm">
                Découvrir nos réalisations
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* EXPERTISES SECTION */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Nos Domaines d'Expertise</h2>
            <p className="text-text-muted text-lg">
              Une maîtrise complète de la chaîne de valeur du BTP et de l'ingénierie, avec un engagement sans compromis sur la qualité.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Compass, title: "Études & Architecture", desc: "Conception architecturale, plans 2D/3D et modélisation BIM." },
              { icon: PenTool, title: "Métré & Devis", desc: "Évaluation précise des coûts, quantitatifs et optimisation budgétaire." },
              { icon: Building2, title: "Construction & BTP", desc: "Réalisation de vos travaux de gros œuvre et second œuvre avec rigueur." },
              { icon: BookOpen, title: "Formation Masterclass", desc: "Formations professionnelles sur les logiciels phares de l'ingénierie." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-accent/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed mb-6 flex-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pourquoi faire appel à RÉVOLUTION GROUP ?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Notre approche repose sur l'innovation, la rigueur technique et le respect des délais. Chaque projet est une nouvelle opportunité de repousser les standards de qualité.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  "Une équipe d'ingénieurs et architectes certifiés.",
                  "Des outils logiciels de pointe (BIM, Robot, AutoCAD).",
                  "Une transparence totale sur les coûts et délais.",
                  "Un suivi rigoureux sur le terrain."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle2 size={24} className="text-accent shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button onClick={() => navigate('/devis')} variant="primary" className="px-8 py-4 flex items-center gap-2 group">
                  Démarrer votre projet <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-3xl overflow-hidden border-4 border-accent/20"
            >
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000" alt="Bureau d'études" className="w-full h-full object-cover" />
              {/* Callout box */}
              <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-md p-6 rounded-2xl border border-border shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted font-medium text-sm">Projets livrés</p>
                    <p className="text-3xl font-bold text-primary">150+</p>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <p className="text-text-muted font-medium text-sm">Experts BTP</p>
                    <p className="text-3xl font-bold text-primary">100%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FORMATIONS CTA SECTION */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
              <BookOpen size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Centre de Formation BTP</h2>
            <p className="text-text-muted text-lg mb-10 max-w-2xl mx-auto">
              Vous êtes étudiant ou professionnel ? Montez en compétence avec nos masterclass exclusives sur les logiciels d'architecture et de calcul de structure. (En ligne ou en présentiel).
            </p>
            <Button onClick={() => navigate('/formations')} variant="outline" className="px-8 py-4 text-base font-bold group">
              Découvrir nos formations <ChevronRight size={20} className="inline group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
