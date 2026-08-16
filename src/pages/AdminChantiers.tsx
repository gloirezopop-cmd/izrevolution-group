import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminChantiers = () => {
  const [chantiers, setChantiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchChantiers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chantiers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setChantiers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChantiers();
  }, []);

  const toggleStatut = async (id: string, currentPublie: boolean) => {
    await supabase.from('chantiers').update({ publie: !currentPublie }).eq('id', id);
    fetchChantiers();
  };

  const deleteChantier = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce chantier ? Cette action est irréversible.')) {
      await supabase.from('chantiers').delete().eq('id', id);
      fetchChantiers();
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion du Portfolio (Chantiers)</h1>
          <p className="text-text-muted">Gérez vos réalisations, mettez à jour l'avancement et les photos.</p>
        </div>
        <Button onClick={() => navigate('/app/admin/chantiers/nouveau')} variant="primary" className="flex items-center gap-2">
          <Plus size={20} /> Nouveau Chantier
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-background/50 border-b border-border uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Projet</th>
              <th className="px-6 py-4 font-semibold text-white">Catégorie</th>
              <th className="px-6 py-4 font-semibold text-white">Année</th>
              <th className="px-6 py-4 font-semibold text-white">Statut du projet</th>
              <th className="px-6 py-4 font-semibold text-white">Visibilité</th>
              <th className="px-6 py-4 font-semibold text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {chantiers.map((c) => (
              <tr key={c.id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{c.titre}</td>
                <td className="px-6 py-4 capitalize">{c.categorie}</td>
                <td className="px-6 py-4">{c.annee || c.date_realisation?.substring(0,4) || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    c.statut === 'livre' ? 'bg-green-500/20 text-green-500' : 
                    c.statut === 'en_cours' ? 'bg-accent/20 text-accent' : 
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {c.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${c.publie ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {c.publie ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => toggleStatut(c.id, c.publie)} className="p-2 text-text-muted hover:text-white transition-colors" title={c.publie ? 'Masquer' : 'Publier'}>
                    {c.publie ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button onClick={() => navigate(`/app/admin/chantiers/${c.id}`)} className="p-2 text-text-muted hover:text-accent transition-colors" title="Éditer">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteChantier(c.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Supprimer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {chantiers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">Aucun chantier trouvé. Cliquez sur "Nouveau Chantier" pour commencer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
