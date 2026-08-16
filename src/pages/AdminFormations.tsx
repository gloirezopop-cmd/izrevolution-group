import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminFormations = () => {
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchFormations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setFormations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const toggleStatut = async (id: string, currentStatut: string) => {
    const newStatut = currentStatut === 'publie' ? 'brouillon' : 'publie';
    await supabase.from('formations').update({ statut: newStatut }).eq('id', id);
    fetchFormations();
  };

  const deleteFormation = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette formation ? Cette action est irréversible.')) {
      await supabase.from('formations').delete().eq('id', id);
      fetchFormations();
    }
  };

  if (loading) return <div className="text-white p-8">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Formations</h1>
          <p className="text-text-muted">Gérez votre catalogue de formations, modules et leçons.</p>
        </div>
        <Button onClick={() => navigate('/app/admin/formations/nouveau')} variant="primary" className="flex items-center gap-2">
          <Plus size={20} /> Nouvelle Formation
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-background/50 border-b border-border uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Titre</th>
              <th className="px-6 py-4 font-semibold text-white">Logiciel</th>
              <th className="px-6 py-4 font-semibold text-white">Prix</th>
              <th className="px-6 py-4 font-semibold text-white">Statut</th>
              <th className="px-6 py-4 font-semibold text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {formations.map((f) => (
              <tr key={f.id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{f.titre}</td>
                <td className="px-6 py-4">{f.categorie}</td>
                <td className="px-6 py-4">{f.prix} FCFA</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${f.statut === 'publie' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {f.statut === 'publie' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => toggleStatut(f.id, f.statut)} className="p-2 text-text-muted hover:text-white transition-colors" title={f.statut === 'publie' ? 'Masquer' : 'Publier'}>
                    {f.statut === 'publie' ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button onClick={() => navigate(`/app/admin/formations/${f.id}`)} className="p-2 text-text-muted hover:text-accent transition-colors" title="Éditer">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteFormation(f.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Supprimer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {formations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">Aucune formation trouvée. Cliquez sur "Nouvelle Formation" pour commencer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
