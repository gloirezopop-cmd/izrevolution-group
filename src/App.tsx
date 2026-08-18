import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Chantiers } from './pages/Chantiers';
import { ChantierDetail } from './pages/ChantierDetail';
import { Devis } from './pages/Devis';
import { Formations } from './pages/Formations';
import { FormationViewer } from './pages/FormationViewer';
import { Perspectives } from './pages/Perspectives';
import { Home } from './pages/Home';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminFormations } from './pages/AdminFormations';
import { AdminFormationBuilder } from './pages/AdminFormationBuilder';
import { MesFormations } from './pages/MesFormations';
import { AdminChantiers } from './pages/AdminChantiers';
import { AdminChantierBuilder } from './pages/AdminChantierBuilder';
import { AdminEquipe } from './pages/AdminEquipe';
import { Parametres } from './pages/Parametres';
import { WhatsAppFloat } from './components/ui/WhatsAppFloat';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/chantiers" element={<PublicLayout><Chantiers /></PublicLayout>} />
            <Route path="/chantiers/:slug" element={<PublicLayout><ChantierDetail /></PublicLayout>} />
            <Route path="/formations" element={<PublicLayout><Formations /></PublicLayout>} />
            <Route path="/formations/:slug" element={<PublicLayout><FormationViewer /></PublicLayout>} />
            <Route path="/devis" element={<PublicLayout><Devis /></PublicLayout>} />

            {/* Routes Privées / Dashboard */}
            <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/app/chantiers" element={<AppLayout><Chantiers /></AppLayout>} />
            <Route path="/app/chantiers/:slug" element={<AppLayout><ChantierDetail /></AppLayout>} />
            <Route path="/app/devis" element={<AppLayout><Devis /></AppLayout>} />
            <Route path="/app/formations" element={<AppLayout><Formations /></AppLayout>} />
            <Route path="/app/formations/:slug" element={<AppLayout><FormationViewer /></AppLayout>} />
            <Route path="/app/mes-formations" element={<AppLayout><MesFormations /></AppLayout>} />
            <Route path="/app/perspectives" element={<AppLayout><Perspectives /></AppLayout>} />
            <Route path="/app/parametres" element={<AppLayout><Parametres /></AppLayout>} />

            {/* Routes Admin */}
            <Route path="/app/admin/formations" element={<AppLayout><AdminFormations /></AppLayout>} />
            <Route path="/app/admin/formations/:id" element={<AppLayout><AdminFormationBuilder /></AppLayout>} />
            <Route path="/app/admin/chantiers" element={<AppLayout><AdminChantiers /></AppLayout>} />
            <Route path="/app/admin/chantiers/:id" element={<AppLayout><AdminChantierBuilder /></AppLayout>} />
            <Route path="/app/admin/equipe" element={<AppLayout><AdminEquipe /></AppLayout>} />
          </Routes>
          <WhatsAppFloat />
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
