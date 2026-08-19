import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [indicatif, setIndicatif] = useState('+237');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Si cet email existe, un lien de réinitialisation y a été envoyé.");
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onClose();
      } else {
        const fullPhone = `${indicatif} ${telephone}`;
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { nom, prenom, telephone: fullPhone }
          }
        });
        if (error) throw error;

        if (data.session) {
          onSuccess();
          onClose();
        } else {
          onClose();
          toast.success("Inscription réussie ! Veuillez vérifier vos emails pour confirmer votre compte, puis connectez-vous pour finaliser votre accès à la formation.", { duration: 6000 });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {isForgotPassword ? 'Mot de passe oublié ?' : isLogin ? 'Bon retour !' : 'Créer un compte'}
                </h2>
                <p className="text-text-muted text-sm">
                  {isForgotPassword 
                    ? 'Entrez votre email pour recevoir un lien de réinitialisation.'
                    : isLogin 
                    ? 'Connectez-vous pour accéder à vos formations.' 
                    : 'Rejoignez RÉVOLUTION GROUP pour suivre nos formations.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                {!isLogin && !isForgotPassword && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Prénom</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon size={16} className="text-text-muted" />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            className="w-full relative z-10 bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                            placeholder="Jean"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Nom</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon size={16} className="text-text-muted" />
                          </div>
                          <input 
                            type="text" 
                            required
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="w-full relative z-10 bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                            placeholder="Dupont"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Téléphone</label>
                      <div className="flex gap-2">
                        <select 
                          className="bg-background border border-border rounded-lg px-2 py-2.5 text-text-main focus:outline-none focus:border-accent relative z-10"
                          value={indicatif}
                          onChange={(e) => setIndicatif(e.target.value)}
                        >
                          <option value="+237">+237 (CMR)</option>
                          <option value="+241">+241 (GAB)</option>
                          <option value="+33">+33 (FRA)</option>
                          <option value="+225">+225 (CIV)</option>
                          <option value="+221">+221 (SEN)</option>
                        </select>
                        <input 
                          type="tel" 
                          required
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          className="flex-1 relative z-10 bg-background border border-border rounded-lg px-4 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                          placeholder="600 00 00 00"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-text-muted" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full relative z-10 bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Mot de passe</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-text-muted" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full relative z-10 bg-background border border-border rounded-lg pl-10 pr-10 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                        placeholder="********"
                        autoComplete="new-password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-text-muted hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {isLogin && !isForgotPassword && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => { setIsForgotPassword(true); setError(null); }}
                      className="text-sm text-accent hover:underline font-medium"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full py-3 mt-4 relative z-10"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : (isForgotPassword ? 'Envoyer le lien' : isLogin ? 'Se connecter' : 'Créer mon compte')}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-text-muted">
                {isForgotPassword ? (
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); setError(null); }}
                    className="text-accent hover:underline font-semibold relative z-10"
                  >
                    Retour à la connexion
                  </button>
                ) : (
                  <>
                    {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setIsForgotPassword(false); setError(null); }}
                      className="text-accent hover:underline font-semibold relative z-10"
                    >
                      {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
