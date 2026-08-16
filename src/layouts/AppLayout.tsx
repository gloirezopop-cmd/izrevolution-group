import React from 'react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, FileText, GraduationCap, Users, Settings, User, Menu, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAdmin, profile } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-primary border-r border-primary-light p-6 flex-col gap-8 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 flex ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3">
          {/* Logo réel */}
          <img src="/brand/logo_cropped.png" alt="Logo RÉVOLUTION GROUP" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
          {/* Fallback si le logo n'est pas encore présent */}
          <div className="w-10 h-10 bg-accent rounded-xl hidden items-center justify-center text-primary font-bold text-sm">RG</div>
          <span className="font-bold text-lg text-white tracking-wide">RÉVOLUTION GROUP</span>
        </div>
        
        
        <nav className="flex-1 flex flex-col gap-2 mt-4">
          <NavItem icon={Home} label="Tableau de bord" to="/app" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={FolderOpen} label="Chantiers" to="/app/chantiers" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={FileText} label="Devis" to="/app/devis" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={GraduationCap} label="Catalogue Formations" to="/app/formations" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={GraduationCap} label="Mes Formations" to="/app/mes-formations" onClick={() => setIsMobileMenuOpen(false)} />
          
          {isAdmin && (
            <div className="mt-6 mb-2">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-4 flex items-center gap-2">
                <ShieldAlert size={14} /> Espace Admin
              </div>
              <NavItem icon={FolderOpen} label="Gérer Chantiers" to="/app/admin/chantiers" onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem icon={GraduationCap} label="Gérer Formations" to="/app/admin/formations" onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem icon={Users} label="Gestion Équipe" to="/app/admin/equipe" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          )}
        </nav>
        
        <nav>
          <NavItem icon={Settings} label="Paramètres" to="/app/parametres" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative w-48 md:w-64 hidden sm:block">
              <input type="text" placeholder="Rechercher..." className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/20 transition-colors shadow-sm">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, to, onClick }: { icon: React.ElementType, label: string, to: string, onClick?: () => void }) => {
  return (
    <NavLink 
      to={to}
      end={to === '/app'}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium ${
          isActive 
            ? 'bg-accent text-primary shadow-soft' 
            : 'text-gray-300 hover:bg-primary-light hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};
