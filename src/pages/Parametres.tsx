import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Bell, Moon, LogOut, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Parametres = () => {
  const { user, profile, isAdmin, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: profile?.nom || '',
    prenom: profile?.prenom || '',
    telephone: profile?.telephone || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        telephone: profile.telephone || ''
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        nom: editForm.nom,
        prenom: editForm.prenom,
        telephone: editForm.telephone
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = async () => {
    try {
      await updateProfile({
        notifications_email: !profile?.notifications_email
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-primary-text">Paramètres</h1>
        <p className="text-text-muted mt-2">Gérez votre compte et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profil */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="text-xl font-bold text-primary-text">Informations Personnelles</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-accent hover:text-accent-hover p-2 transition-colors">
                  <Edit2 size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-text-muted hover:text-red-500 p-2 transition-colors">
                    <X size={18} />
                  </button>
                  <button onClick={handleSaveProfile} disabled={isSaving} className="text-accent hover:text-accent-hover p-2 transition-colors">
                    <Save size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary-text border border-primary/20 flex-shrink-0">
                  <User size={32} />
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                      <label className="text-xs text-text-muted">Nom</label>
                      <input 
                        type="text" 
                        value={editForm.nom}
                        onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary-text focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted">Prénom</label>
                      <input 
                        type="text" 
                        value={editForm.prenom}
                        onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary-text focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg text-primary-text">
                      {profile?.prenom || profile?.nom ? `${profile.prenom || ''} ${profile.nom || ''}` : 'Utilisateur'}
                    </h3>
                    <p className="text-text-muted text-sm capitalize">{profile?.role || 'Client'}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email</label>
                  <div className="flex items-center gap-2 text-primary-text font-medium bg-background px-4 py-2 rounded-lg border border-border">
                    <Mail size={16} className="text-accent" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Téléphone</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={editForm.telephone}
                      onChange={(e) => setEditForm({...editForm, telephone: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary-text focus:outline-none focus:border-accent font-medium h-[42px]"
                      placeholder="+237 ..."
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-primary-text font-medium bg-background px-4 py-2 rounded-lg border border-border h-[42px]">
                      <span className="truncate">{profile?.telephone || 'Non renseigné'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Rôle système</label>
                  <div className="flex items-center gap-2 text-primary-text font-medium bg-background px-4 py-2 rounded-lg border border-border">
                    <Shield size={16} className={isAdmin ? "text-red-500" : "text-accent"} />
                    <span className="capitalize">{profile?.role || 'Client'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-primary-text mb-6 border-b border-border pb-4">Préférences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-accent" />
                  <div>
                    <h4 className="font-semibold text-primary-text text-sm">Notifications par email</h4>
                    <p className="text-xs text-text-muted">Recevoir des mises à jour sur mes devis et formations.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile?.notifications_email ?? true}
                    onChange={handleToggleNotification}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-primary-text" />
                  <div>
                    <h4 className="font-semibold text-primary-text text-sm">Mode Sombre</h4>
                    <p className="text-xs text-text-muted">Thème d'affichage de l'interface.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Compte */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-primary-text mb-4 border-b border-border pb-2">Sécurité</h2>
            <p className="text-sm text-text-muted mb-4">
              Pour des raisons de sécurité, les changements de mot de passe se font uniquement par email de récupération.
            </p>
            <Button variant="outline" className="w-full text-sm">
              Réinitialiser le mot de passe
            </Button>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-red-600 mb-4 border-b border-red-100 pb-2">Déconnexion</h2>
            <p className="text-sm text-red-600/80 mb-4">
              Fermez votre session en toute sécurité sur cet appareil.
            </p>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2 dark:hover:bg-red-900/50"
            >
              <LogOut size={16} /> Me déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
