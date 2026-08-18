import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileSignature, Calculator, HardHat, CheckCircle2, FileText, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Devis = () => {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nom_client: '',
    telephone: '',
    email: '',
    localisation: '',
    type_projet: '',
    description: ''
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let pieces_jointes: string[] = [];

      // Optional: upload files to devis bucket if policies exist
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('devis')
            .upload(filePath, file);

          if (!uploadError && data) {
            pieces_jointes.push(data.path);
          }
        }
      }

      const { error } = await supabase
        .from('devis')
        .insert({
          client_id: user?.id || null,
          nom_client: formData.nom_client,
          telephone: formData.telephone,
          email: formData.email,
          localisation: formData.localisation,
          type_projet: formData.type_projet,
          description: formData.description,
          pieces_jointes: pieces_jointes,
          statut: 'nouveau'
        });

      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Erreur lors de la soumission du devis:', error);
      setSubmitError('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter sur WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center py-20 max-w-2xl mx-auto text-center gap-6"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-primary">Demande envoyée avec succès !</h2>
        <p className="text-text-muted text-lg">
          L'équipe RÉVOLUTION GROUP a bien reçu votre demande de devis. Un ingénieur va l'analyser et vous recontactera très prochainement au numéro que vous avez indiqué.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
          Faire une nouvelle demande
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-10 max-w-6xl mx-auto pb-12"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">Études & Devis sur Mesure</h1>
        <p className="text-text-muted text-lg">
          Confiez-nous l'étude technique, le métré et la réalisation de votre projet de construction. Remplissez le formulaire ci-dessous pour obtenir une estimation précise et professionnelle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center text-center p-8 gap-4 border-accent-orange/20 hover:border-accent transition-colors">
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
            <Calculator size={32} />
          </div>
          <h3 className="font-bold text-lg">Étude & Métré</h3>
          <p className="text-sm text-text-muted">Calcul précis des quantités et coûts des matériaux (Béton armé, architecture).</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-8 gap-4 border-accent-orange/20 hover:border-accent transition-colors bg-primary text-white border-none shadow-xl transform md:-translate-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
            <FileSignature size={32} />
          </div>
          <h3 className="font-bold text-lg">Devis de Réalisation</h3>
          <p className="text-sm text-white/80">Offre financière complète pour la réalisation clé en main de votre ouvrage.</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-8 gap-4 border-accent-orange/20 hover:border-accent transition-colors">
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
            <HardHat size={32} />
          </div>
          <h3 className="font-bold text-lg">Suivi de Chantier</h3>
          <p className="text-sm text-text-muted">Expertise qualité et accompagnement technique tout au long des travaux.</p>
        </Card>
      </div>

      <Card className="p-8 md:p-12 shadow-xl border-border/50">
        <h2 className="text-2xl font-bold mb-8 border-b border-border pb-4">Demander un Devis</h2>
        
        {submitError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">Nom Complet / Entreprise *</label>
              <input 
                type="text" 
                required 
                value={formData.nom_client}
                onChange={e => setFormData({...formData, nom_client: e.target.value})}
                className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors" 
                placeholder="Ex: Jean Dupont" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">Téléphone (WhatsApp de préférence) *</label>
              <input 
                type="tel" 
                required 
                value={formData.telephone}
                onChange={e => setFormData({...formData, telephone: e.target.value})}
                className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors" 
                placeholder="Ex: +237 600 00 00 00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">Adresse E-mail</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors" 
                placeholder="Ex: contact@email.com" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">Localisation du projet *</label>
              <input 
                type="text" 
                required 
                value={formData.localisation}
                onChange={e => setFormData({...formData, localisation: e.target.value})}
                className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors" 
                placeholder="Ex: Douala, Bonamoussadi" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-main">Type de prestation souhaitée *</label>
            <select 
              required 
              value={formData.type_projet}
              onChange={e => setFormData({...formData, type_projet: e.target.value})}
              className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Sélectionnez un service...</option>
              <option value="metre">Étude et Métré uniquement (Devis quantitatif et estimatif)</option>
              <option value="construction">Construction clé en main</option>
              <option value="suivi">Suivi et Contrôle de Chantier</option>
              <option value="architecture">Conception Architecturale (Plans)</option>
              <option value="autre">Autre demande</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-main">Description détaillée du projet *</label>
            <textarea 
              required 
              rows={5} 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors resize-none" 
              placeholder="Décrivez votre besoin (ex: Construction d'un immeuble R+3 à usage d'habitation avec parking...)"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-main">Joindre des plans ou documents (Optionnel)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:bg-background cursor-pointer transition-colors relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              {files.length > 0 ? (
                <div className="flex flex-col gap-2 relative z-10 pointer-events-none text-left">
                  <p className="text-sm font-semibold text-text-main mb-2">Documents sélectionnés ({files.length}) :</p>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-background border border-border p-3 rounded-lg">
                      <FileText size={20} className="text-accent flex-shrink-0" />
                      <span className="text-sm font-medium text-primary-text truncate">{file.name}</span>
                    </div>
                  ))}
                  <p className="text-xs text-text-muted mt-2 text-center">Cliquez à nouveau pour modifier la sélection</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                  <UploadCloud size={32} className="text-text-muted" />
                  <p className="text-text-muted text-sm">Cliquez ici ou glissez-déposez vos fichiers (PDF, JPG, PNG)</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full md:w-auto px-8 py-4 text-lg">
              {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER LA DEMANDE'}
            </Button>
            <p className="text-xs text-text-muted mt-4 text-center md:text-left">
              * Champs obligatoires. En soumettant ce formulaire, vous acceptez d'être recontacté par RÉVOLUTION GROUP.
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
