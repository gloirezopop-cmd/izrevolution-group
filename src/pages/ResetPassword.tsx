import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a bien un session token (venant de l'email)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.');
        navigate('/');
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;

      toast.success('Votre mot de passe a été réinitialisé avec succès.');
      navigate('/app');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Nouveau mot de passe</h2>
          <p className="text-text-muted text-sm">
            Veuillez entrer votre nouveau mot de passe ci-dessous.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Nouveau mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-text-muted" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full relative z-10 bg-background border border-border rounded-lg pl-10 pr-10 py-2.5 text-text-main focus:outline-none focus:border-accent transition-colors"
                placeholder="********"
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

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
          </Button>
        </form>
      </div>
    </div>
  );
};
