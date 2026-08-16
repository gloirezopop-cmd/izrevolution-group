import React from 'react';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { prospectsService } from '../services/api';
import type { Prospect } from '../types';

export const Perspectives = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    prospectsService.getProspects().then(setProspects);
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text-main">Perspectives</h1>
        <p className="text-text-muted mt-2">Suivez les demandes entrantes (prospects).</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 font-semibold text-text-muted text-sm uppercase">Date</th>
              <th className="pb-4 font-semibold text-text-muted text-sm uppercase">Nom</th>
              <th className="pb-4 font-semibold text-text-muted text-sm uppercase">Motif</th>
              <th className="pb-4 font-semibold text-text-muted text-sm uppercase">Pays</th>
              <th className="pb-4 font-semibold text-text-muted text-sm uppercase">Statut</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                <td className="py-4 text-text-muted text-sm">{p.cree_le}</td>
                <td className="py-4 font-medium">{p.nom}</td>
                <td className="py-4 capitalize">{p.motif}</td>
                <td className="py-4">{p.pays}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    p.statut === 'nouveau' ? 'border-accent text-accent bg-accent/10' : 'border-border text-text-muted'
                  }`}>
                    {p.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
