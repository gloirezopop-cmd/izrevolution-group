import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, ShieldAlert, User, Search, RefreshCw, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export const AdminEquipe = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const { user } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      toast.error("Erreur lors de la modification du rôle.");
    }
    setUpdating(null);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !user) return;
    
    setInviting(true);
    try {
      // Create invitation record
      const { error } = await supabase.from('admin_invitations').insert({
        email: inviteEmail.toLowerCase(),
        invited_by: user.id
      });
      
      if (error && error.code !== '23505') throw error; // Ignore if already invited
      
      // Open email client
      const subject = encodeURIComponent("Invitation à administrer Révolution Group");
      const body = encodeURIComponent(
        `Bonjour,\n\nVous avez été invité à devenir Administrateur sur Révolution Group.\n\nVeuillez créer votre compte avec cette adresse email en cliquant sur le lien suivant :\nhttps://izrevolution-group.vercel.app/app\n\nVotre compte sera automatiquement promu Administrateur dès votre inscription.\n\nCordialement,\nL'équipe Révolution Group`
      );
      window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
      
      toast.success("Invitation préparée ! Votre boîte mail va s'ouvrir.");
      setInviteEmail('');
    } catch (err: any) {
      toast.error("Erreur lors de l'invitation.");
      console.error(err);
    } finally {
      setInviting(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.nom || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.prenom || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion de l'équipe</h1>
          <p className="text-text-muted">Gérez les administrateurs et les accès de vos collaborateurs.</p>
        </div>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-text-main focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Mail size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-1">Inviter un nouvel Administrateur</h2>
            <p className="text-sm text-text-muted mb-4">
              Envoyez une invitation par email. Dès que la personne créera son compte avec cette adresse, elle deviendra automatiquement administrateur.
            </p>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input 
                  type="email" 
                  required
                  placeholder="Adresse email du collaborateur..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-main focus:outline-none focus:border-accent"
                />
              </div>
              <button 
                type="submit"
                disabled={inviting || !inviteEmail}
                className="bg-accent text-primary font-bold py-2.5 px-6 rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviting ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                Envoyer l'invitation
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-muted">
            <thead className="text-xs uppercase bg-background/50 text-text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">ID / Inscription</th>
                <th className="px-6 py-4 font-semibold">Rôle actuel</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-accent animate-pulse">Chargement des utilisateurs...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">Aucun utilisateur trouvé.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.nom ? user.nom.charAt(0).toUpperCase() : <User size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.prenom} {user.nom}</p>
                          <p className="text-xs">{user.telephone || 'Sans téléphone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs truncate w-32" title={user.id}>{user.id.split('-')[0]}...</p>
                      <p className="text-xs mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          <ShieldAlert size={12} /> Administrateur
                        </span>
                      ) : user.role === 'equipe' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          <Shield size={12} /> Équipe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-300 border border-gray-500/20">
                          <User size={12} /> Client
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        disabled={updating === user.id}
                        value={user.role || 'client'}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="bg-background border border-border rounded-lg px-3 py-1.5 text-text-main text-xs focus:outline-none focus:border-accent disabled:opacity-50"
                      >
                        <option value="client">Rendre Client</option>
                        <option value="equipe">Nommer Équipe</option>
                        <option value="admin">Nommer Administrateur</option>
                      </select>
                      {updating === user.id && <RefreshCw size={14} className="inline ml-2 animate-spin text-accent" />}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
