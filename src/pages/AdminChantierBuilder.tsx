import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Save, Upload, Trash2, Image as ImageIcon, GripVertical, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminChantierBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nouveau';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [chantier, setChantier] = useState<any>({
    titre: '',
    description: '',
    categorie: 'btp',
    localisation: '',
    annee: new Date().getFullYear(),
    statut: 'en_cours',
    progression: 0,
    date_debut: '',
    date_fin: '',
    publie: false,
    image_principale: '',
    galerie_images: [],
    prestations: []
  });

  const [prestationInput, setPrestationInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchChantier();
    }
  }, [id]);

  const fetchChantier = async () => {
    const { data } = await supabase.from('chantiers').select('*').eq('id', id).single();
    if (data) {
      setChantier({
        ...data,
        galerie_images: data.galerie_images || [],
        prestations: data.prestations || []
      });
    }
    setLoading(false);
  };

  const saveChantier = async () => {
    setSaving(true);
    let currentId = id;
    
    if (isNew) {
      const { data, error } = await supabase.from('chantiers').insert(chantier).select().single();
      if (data) currentId = data.id;
    } else {
      await supabase.from('chantiers').update(chantier).eq('id', id);
    }

    if (currentId) {
      navigate('/app/admin/chantiers');
    }
    setSaving(false);
  };

  const addPrestation = () => {
    if (prestationInput.trim()) {
      setChantier({ ...chantier, prestations: [...chantier.prestations, prestationInput.trim()] });
      setPrestationInput('');
    }
  };

  const removePrestation = (index: number) => {
    setChantier({
      ...chantier,
      prestations: chantier.prestations.filter((_: any, i: number) => i !== index)
    });
  };

  const uploadImage = async (file: File, isMain: boolean = false) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('chantiers').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('chantiers').getPublicUrl(filePath);
      
      if (isMain) {
        setChantier({ ...chantier, image_principale: data.publicUrl });
      } else {
        setChantier({ ...chantier, galerie_images: [...chantier.galerie_images, data.publicUrl] });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (window.confirm('Voulez-vous vraiment retirer cette image de la galerie ?')) {
      // Optionnel : On pourrait aussi supprimer l'image du bucket Supabase pour économiser de l'espace.
      setChantier({
        ...chantier,
        galerie_images: chantier.galerie_images.filter((_: any, i: number) => i !== index)
      });
    }
  };

  // Permet de réorganiser la galerie de façon simplifiée (monter/descendre)
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newImages = [...chantier.galerie_images];
      const temp = newImages[index];
      newImages[index] = newImages[index - 1];
      newImages[index - 1] = temp;
      setChantier({ ...chantier, galerie_images: newImages });
    } else if (direction === 'down' && index < chantier.galerie_images.length - 1) {
      const newImages = [...chantier.galerie_images];
      const temp = newImages[index];
      newImages[index] = newImages[index + 1];
      newImages[index + 1] = temp;
      setChantier({ ...chantier, galerie_images: newImages });
    }
  };

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/admin/chantiers')} className="p-2 bg-background border border-border rounded-lg text-text-muted hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{isNew ? 'Créer un projet' : 'Éditer le projet'}</h1>
            <p className="text-text-muted">Configurez les détails du chantier et ses photos.</p>
          </div>
        </div>
        <Button onClick={saveChantier} variant="primary" disabled={saving || uploading} className="flex items-center gap-2">
          <Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer le chantier'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale : Informations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2">Informations Générales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Titre du projet</label>
                <input 
                  type="text" 
                  value={chantier.titre}
                  onChange={(e) => setChantier({...chantier, titre: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Catégorie</label>
                <select 
                  value={chantier.categorie}
                  onChange={(e) => setChantier({...chantier, categorie: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option value="btp">BTP</option>
                  <option value="architecture">Architecture</option>
                  <option value="etude">Étude</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Localisation</label>
                <input 
                  type="text" 
                  value={chantier.localisation}
                  onChange={(e) => setChantier({...chantier, localisation: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Année</label>
                <input 
                  type="number" 
                  value={chantier.annee}
                  onChange={(e) => setChantier({...chantier, annee: parseInt(e.target.value)})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Description</label>
              <textarea 
                value={chantier.description}
                onChange={(e) => setChantier({...chantier, description: e.target.value})}
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2">Planification & Avancement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Statut</label>
                <select 
                  value={chantier.statut}
                  onChange={(e) => setChantier({...chantier, statut: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option value="en_cours">En cours</option>
                  <option value="livre">Livré</option>
                  <option value="en_etude">En étude</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Progression (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  value={chantier.progression}
                  onChange={(e) => setChantier({...chantier, progression: parseInt(e.target.value)})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Date de début</label>
                <input 
                  type="date" 
                  value={chantier.date_debut || ''}
                  onChange={(e) => setChantier({...chantier, date_debut: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Date de fin prévue</label>
                <input 
                  type="date" 
                  value={chantier.date_fin || ''}
                  onChange={(e) => setChantier({...chantier, date_fin: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Prestations réalisées</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={prestationInput}
                  onChange={(e) => setPrestationInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') addPrestation(); }}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                  placeholder="Ex: Gros oeuvre, Plomberie..."
                />
                <Button onClick={addPrestation} variant="outline" type="button">Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {chantier.prestations.map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-1 bg-background border border-border px-3 py-1 rounded-full text-sm text-white">
                    {p}
                    <button onClick={() => removePrestation(i)} className="text-text-muted hover:text-red-500 ml-2">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Latérale : Photos & Publication */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2">Visibilité</h2>
            <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
              <span className="font-semibold text-white">Publier ce projet ?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={chantier.publie} onChange={(e) => setChantier({...chantier, publie: e.target.checked})} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            <p className="text-xs text-text-muted">Si inactif, le projet n'apparaîtra pas dans le portfolio public.</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2 flex items-center justify-between">
              Image Principale
              {uploading && <span className="text-xs text-accent animate-pulse">Upload...</span>}
            </h2>
            
            {chantier.image_principale ? (
              <div className="relative group rounded-lg overflow-hidden border border-border">
                <img src={chantier.image_principale} alt="Principale" className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-4 py-2 bg-white/10 backdrop-blur rounded hover:bg-white/20 text-white font-medium flex items-center gap-2">
                    <Upload size={16} /> Remplacer
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadImage(e.target.files[0], true)} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-border border-dashed rounded-lg cursor-pointer bg-background hover:bg-background/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-text-muted" />
                  <p className="text-sm text-text-muted"><span className="font-semibold text-accent">Cliquez pour uploader</span></p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && uploadImage(e.target.files[0], true)} />
              </label>
            )}
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2 flex items-center justify-between">
              Galerie Photos
              <label className="cursor-pointer text-xs flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded hover:bg-accent hover:text-primary transition-colors">
                <Plus size={14} /> Ajouter
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => uploadImage(file, false));
                  }
                }} />
              </label>
            </h2>

            <div className="space-y-3">
              {chantier.galerie_images.map((img: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-background border border-border p-2 rounded-lg group">
                  <div className="flex flex-col gap-1 text-text-muted">
                    <button onClick={() => moveImage(index, 'up')} disabled={index === 0} className="hover:text-white disabled:opacity-30">▲</button>
                    <button onClick={() => moveImage(index, 'down')} disabled={index === chantier.galerie_images.length - 1} className="hover:text-white disabled:opacity-30">▼</button>
                  </div>
                  <img src={img} alt={`Galerie ${index}`} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 text-xs text-text-muted truncate">
                    Image {index + 1}
                  </div>
                  <button onClick={() => removeGalleryImage(index)} className="p-2 text-text-muted hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {chantier.galerie_images.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">Aucune photo supplémentaire.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
