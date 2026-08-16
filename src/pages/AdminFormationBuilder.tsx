import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Video, FileText } from 'lucide-react';

export const AdminFormationBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nouveau';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingLecon, setUploadingLecon] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formation, setFormation] = useState<any>({
    titre: '',
    description: '',
    categorie: '',
    prix: 0,
    duree_h: 0,
    mode: 'mixte',
    statut: 'brouillon',
    niveau: 'debutant',
    image: ''
  });

  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchFormation();
    }
  }, [id]);

  const fetchFormation = async () => {
    // 1. Fetch Formation
    const { data: fData } = await supabase.from('formations').select('*').eq('id', id).single();
    if (fData) setFormation(fData);
    
    // 2. Fetch Modules et Lecons
    const { data: mData } = await supabase.from('modules').select('*, lecons(*)').eq('formation_id', id).order('ordre', { ascending: true });
    if (mData) {
      // Sort lecons
      const sortedModules = mData.map(m => ({
        ...m,
        lecons: m.lecons ? m.lecons.sort((a: any, b: any) => a.ordre - b.ordre) : []
      }));
      setModules(sortedModules);
    }
    
    setLoading(false);
  };

  const saveFormation = async () => {
    setSaving(true);
    let currentId = id;
    
    // Save Formation
    if (isNew) {
      const { data, error } = await supabase.from('formations').insert(formation).select().single();
      if (data) currentId = data.id;
    } else {
      await supabase.from('formations').update(formation).eq('id', id);
    }

    if (currentId) {
      navigate('/app/admin/formations');
    }
    setSaving(false);
  };

  const addModule = async () => {
    if (isNew) {
      alert("Enregistrez d'abord la formation avant d'ajouter des modules.");
      return;
    }
    const newOrdre = modules.length > 0 ? Math.max(...modules.map(m => m.ordre)) + 1 : 1;
    const { data, error } = await supabase.from('modules').insert({
      formation_id: id,
      titre: `Nouveau module ${newOrdre}`,
      ordre: newOrdre
    }).select().single();

    if (data) {
      setModules([...modules, { ...data, lecons: [] }]);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce module et toutes ses leçons ?')) {
      await supabase.from('modules').delete().eq('id', moduleId);
      setModules(modules.filter(m => m.id !== moduleId));
    }
  };

  const addLecon = async (moduleId: string, type: 'video' | 'document') => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;

    const newOrdre = mod.lecons.length > 0 ? Math.max(...mod.lecons.map((l:any) => l.ordre)) + 1 : 1;
    const newLecon = {
      module_id: moduleId,
      titre: `Nouvelle ${type === 'video' ? 'vidéo' : 'leçon'}`,
      type: type,
      ordre: newOrdre,
      duree_minutes: type === 'video' ? 10 : 0
    };

    const { data, error } = await supabase.from('lecons').insert(newLecon).select().single();
    if (data) {
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lecons: [...m.lecons, data] };
        }
        return m;
      }));
    }
  };

  const deleteLecon = async (moduleId: string, leconId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette leçon ?')) {
      await supabase.from('lecons').delete().eq('id', leconId);
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lecons: m.lecons.filter((l:any) => l.id !== leconId) };
        }
        return m;
      }));
    }
  };

  const updateModuleTitle = async (moduleId: string, newTitle: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, titre: newTitle } : m));
    await supabase.from('modules').update({ titre: newTitle }).eq('id', moduleId);
  };

  const updateLeconTitle = async (moduleId: string, leconId: string, newTitle: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lecons: m.lecons.map((l:any) => l.id === leconId ? { ...l, titre: newTitle } : l) };
      }
      return m;
    }));
    await supabase.from('lecons').update({ titre: newTitle }).eq('id', leconId);
  };

  const uploadLeconFile = async (moduleId: string, leconId: string, file: File) => {
    try {
      setUploadingLecon(leconId);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${moduleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('formations').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('formations').getPublicUrl(filePath);
      
      const newUrl = data.publicUrl;
      
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lecons: m.lecons.map((l:any) => l.id === leconId ? { ...l, url_contenu: newUrl } : l) };
        }
        return m;
      }));
      
      await supabase.from('lecons').update({ url_contenu: newUrl }).eq('id', leconId);
    } catch (error) {
      console.error('Erreur upload leçon:', error);
      alert('Erreur lors de l\'upload du fichier.');
    } finally {
      setUploadingLecon(null);
    }
  };

  const uploadCouverture = async (file: File) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `couvertures/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('formations').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('formations').getPublicUrl(filePath);
      
      setFormation({ ...formation, image: data.publicUrl });
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/app/admin/formations')} className="p-2 bg-background border border-border rounded-lg text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{isNew ? 'Créer une formation' : 'Éditer la formation'}</h1>
          <p className="text-text-muted">Configurez les informations principales de la formation.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Titre de la formation</label>
            <input 
              type="text" 
              value={formation.titre}
              onChange={(e) => setFormation({...formation, titre: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              placeholder="Ex: Maîtrise de AutoCAD"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Logiciel / Catégorie</label>
            <input 
              type="text" 
              value={formation.categorie}
              onChange={(e) => setFormation({...formation, categorie: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
              placeholder="Ex: AutoCAD"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Prix (FCFA)</label>
            <input 
              type="number" 
              value={formation.prix}
              onChange={(e) => setFormation({...formation, prix: parseInt(e.target.value)})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Durée (Heures)</label>
            <input 
              type="number" 
              value={formation.duree_h}
              onChange={(e) => setFormation({...formation, duree_h: parseInt(e.target.value)})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Mode</label>
            <select 
              value={formation.mode}
              onChange={(e) => setFormation({...formation, mode: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            >
              <option value="en_ligne">En ligne (E-learning)</option>
              <option value="presentiel">Présentiel</option>
              <option value="mixte">Mixte (En ligne + Présentiel)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Niveau</label>
            <select 
              value={formation.niveau}
              onChange={(e) => setFormation({...formation, niveau: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent"
            >
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Image de couverture (Miniature)</label>
          <div className="flex items-start gap-6">
            {formation.image ? (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-border group">
                <img src={formation.image} alt="Couverture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-primary-light transition-colors">
                    Changer
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadCouverture(e.target.files[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="w-48 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted bg-background/50">
                {uploadingImage ? (
                  <span className="text-sm animate-pulse text-accent">Upload en cours...</span>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center hover:text-primary transition-colors">
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Ajouter une image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadCouverture(e.target.files[0])} />
                  </label>
                )}
              </div>
            )}
            <div className="flex-1 text-sm text-text-muted">
              <p>Format recommandé : 16:9 (ex: 800x450 pixels).</p>
              <p>Poids maximum : 2 Mo.</p>
              <p className="mt-2 text-xs">Cette image sera affichée sur la carte de la formation dans le catalogue.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Description détaillée</label>
          <textarea 
            value={formation.description}
            onChange={(e) => setFormation({...formation, description: e.target.value})}
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent resize-none"
            placeholder="Décrivez le contenu de la formation..."
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button onClick={saveFormation} variant="primary" disabled={saving} className="flex items-center gap-2">
            <Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer la formation'}
          </Button>
        </div>
      </div>
      
      {!isNew && (
        <div className="mt-8 bg-surface border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Programme de la formation</h2>
            <Button onClick={addModule} variant="outline" className="flex items-center gap-2 py-1.5 px-3 text-sm">
              <Plus size={16} /> Ajouter un module
            </Button>
          </div>
          
          <div className="space-y-6">
            {modules.map((m: any) => (
              <div key={m.id} className="border border-border/50 bg-background/50 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 bg-background/80 border-b border-border/50">
                  <GripVertical size={20} className="text-text-muted cursor-grab" />
                  <div className="font-bold text-primary">Module {m.ordre}</div>
                  <input 
                    type="text" 
                    value={m.titre}
                    onChange={(e) => updateModuleTitle(m.id, e.target.value)}
                    className="flex-1 bg-transparent border-none text-white font-bold focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1"
                  />
                  <button onClick={() => deleteModule(m.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-4 space-y-2">
                  {m.lecons?.map((l: any, index: number) => (
                    <div key={l.id} className="flex items-center gap-3 p-2 pl-8 bg-surface rounded-lg border border-border/30 group">
                      <GripVertical size={16} className="text-text-muted/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.type === 'video' ? <Video size={16} className="text-accent" /> : <FileText size={16} className="text-primary" />}
                      <span className="text-sm text-text-muted">{index + 1}.</span>
                      <input 
                        type="text" 
                        value={l.titre}
                        onChange={(e) => updateLeconTitle(m.id, l.id, e.target.value)}
                        className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1"
                      />
                      
                      {uploadingLecon === l.id ? (
                        <span className="text-xs text-accent animate-pulse">Upload en cours...</span>
                      ) : (
                        <label className={`text-xs cursor-pointer px-2 py-1 rounded transition-colors flex items-center gap-1 ${l.url_contenu ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-primary/20 text-primary-light hover:bg-primary/30'}`}>
                          {l.url_contenu ? 'Fichier attaché' : 'Uploader fichier'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept={l.type === 'video' ? 'video/*' : 'application/pdf,application/vnd.ms-excel'} 
                            onChange={(e) => e.target.files && uploadLeconFile(m.id, l.id, e.target.files[0])} 
                          />
                        </label>
                      )}

                      <button onClick={() => deleteLecon(m.id, l.id)} className="p-1.5 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="pl-14 pt-2 flex gap-2">
                    <button onClick={() => addLecon(m.id, 'video')} className="text-xs font-medium text-text-muted hover:text-accent transition-colors flex items-center gap-1">
                      <Plus size={14} /> Vidéo
                    </button>
                    <button onClick={() => addLecon(m.id, 'document')} className="text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-1">
                      <Plus size={14} /> Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {modules.length === 0 && (
              <div className="text-center py-8 text-text-muted border-2 border-dashed border-border rounded-xl">
                Aucun module pour le moment. Cliquez sur "Ajouter un module" pour commencer.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
