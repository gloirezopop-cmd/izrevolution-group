import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, ShoppingCart, Activity, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    uniqueVisitors: 0,
    pageViews: 0,
    inscriptions: 0,
    devis: 0
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [latestInscriptions, setLatestInscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Analytics (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());
        
      // 2. Fetch Inscriptions
      const { data: inscriptions, count: inscriptionsCount } = await supabase
        .from('inscriptions_formations')
        .select(`
          id, 
          created_at, 
          statut, 
          profiles:utilisateur_id(nom, prenom), 
          formations:formation_id(titre)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      // 3. Fetch Devis count
      const { count: devisCount } = await supabase
        .from('devis')
        .select('*', { count: 'exact', head: true });

      // Process analytics data
      let uniqueSessions = new Set();
      let pageViewsByDay: Record<string, { views: number, unique: Set<string> }> = {};
      let pagesCount: Record<string, number> = {};

      if (analytics) {
        analytics.forEach(event => {
          if (event.event_type === 'page_view') {
            const dateStr = new Date(event.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
            
            // Unique visitors
            if (event.session_id) uniqueSessions.add(event.session_id);
            
            // Daily stats for chart
            if (!pageViewsByDay[dateStr]) {
              pageViewsByDay[dateStr] = { views: 0, unique: new Set() };
            }
            pageViewsByDay[dateStr].views += 1;
            if (event.session_id) pageViewsByDay[dateStr].unique.add(event.session_id);

            // Top pages
            const path = event.path || '/';
            pagesCount[path] = (pagesCount[path] || 0) + 1;
          }
        });
      }

      // Format chart data
      const formattedChartData = Object.keys(pageViewsByDay).map(date => ({
        date,
        'Vues': pageViewsByDay[date].views,
        'Visiteurs': pageViewsByDay[date].unique.size
      }));

      // Format top pages
      const formattedTopPages = Object.entries(pagesCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, views]) => ({ path, views }));

      setStats({
        uniqueVisitors: uniqueSessions.size,
        pageViews: analytics ? analytics.length : 0,
        inscriptions: inscriptionsCount || 0,
        devis: devisCount || 0
      });

      setChartData(formattedChartData);
      setTopPages(formattedTopPages);
      if (inscriptions) setLatestInscriptions(inscriptions);

    } catch (error) {
      console.error("Erreur lors du chargement des statistiques", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-muted animate-pulse">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Tableau de bord Analytique</h1>
        <p className="text-text-muted">Vue d'ensemble des performances de votre plateforme.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-surface border border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Visiteurs uniques</p>
              <h3 className="text-3xl font-bold text-text-main">{stats.uniqueVisitors}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-text-muted">Sur les 30 derniers jours</p>
        </Card>

        <Card className="p-6 bg-surface border border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Vues de pages</p>
              <h3 className="text-3xl font-bold text-text-main">{stats.pageViews}</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-xs text-text-muted">Sur les 30 derniers jours</p>
        </Card>

        <Card className="p-6 bg-surface border border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Inscriptions (Ventes)</p>
              <h3 className="text-3xl font-bold text-text-main">{stats.inscriptions}</h3>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
              <ShoppingCart size={24} />
            </div>
          </div>
          <p className="text-xs text-text-muted">Total des inscrits</p>
        </Card>

        <Card className="p-6 bg-surface border border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Demandes de Devis</p>
              <h3 className="text-3xl font-bold text-text-main">{stats.devis}</h3>
            </div>
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-xs text-text-muted">Total des demandes</p>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6 bg-surface border border-border mb-8">
        <h3 className="text-lg font-bold text-text-main mb-6">Trafic du site (30 derniers jours)</h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="Vues" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVues)" />
                <Area type="monotone" dataKey="Visiteurs" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisiteurs)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted">
              Pas encore assez de données pour afficher le graphique.
            </div>
          )}
        </div>
      </Card>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-surface border border-border">
          <h3 className="text-lg font-bold text-text-main mb-6">Pages les plus visitées</h3>
          {topPages.length > 0 ? (
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted font-mono text-sm">{index + 1}</span>
                    <span className="text-text-main font-medium">{page.path}</span>
                  </div>
                  <div className="bg-background px-3 py-1 rounded-full text-sm font-semibold text-text-main">
                    {page.views} vues
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4">Aucune donnée disponible</p>
          )}
        </Card>

        <Card className="p-6 bg-surface border border-border">
          <h3 className="text-lg font-bold text-text-main mb-6">Dernières Inscriptions</h3>
          {latestInscriptions.length > 0 ? (
            <div className="space-y-4">
              {latestInscriptions.map((insc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <p className="text-text-main font-semibold">
                      {insc.profiles?.prenom} {insc.profiles?.nom}
                    </p>
                    <p className="text-text-muted text-xs truncate max-w-[200px]">
                      {insc.formations?.titre}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${insc.statut === 'valide' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {insc.statut}
                    </span>
                    <p className="text-text-muted text-xs mt-1">
                      {new Date(insc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4">Aucune inscription récente</p>
          )}
        </Card>
      </div>
    </div>
  );
};
