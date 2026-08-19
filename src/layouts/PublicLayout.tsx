import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Phone, Mail, MapPin, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navigation (Navbar) */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/brand/logo_cropped.png" alt="Logo RÉVOLUTION GROUP" className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
              <div className="w-12 h-12 bg-accent rounded-xl hidden items-center justify-center text-primary font-bold text-sm">RG</div>
              <span className="font-bold text-xl text-primary tracking-wide">RÉVOLUTION GROUP</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/" end className={({ isActive }) => `text-sm font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-text-main'}`}>Accueil</NavLink>
              <NavLink to="/chantiers" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-text-main'}`}>Réalisations</NavLink>
              <NavLink to="/formations" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-text-main'}`}>Masterclass</NavLink>
              
              {user ? (
                <Button onClick={() => navigate('/app')} variant="outline" className="ml-4 flex items-center gap-2">
                  <UserIcon size={18} /> Mon Espace
                </Button>
              ) : (
                <Button onClick={() => navigate('/devis')} variant="primary" className="ml-4">
                  Demander un Devis
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-xl text-text-main hover:bg-primary/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border absolute w-full left-0 shadow-lg">
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium ${isActive ? 'bg-primary/5 text-accent' : 'text-text-main hover:bg-primary/5'}`}>Accueil</NavLink>
              <NavLink to="/chantiers" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium ${isActive ? 'bg-primary/5 text-accent' : 'text-text-main hover:bg-primary/5'}`}>Réalisations</NavLink>
              <NavLink to="/formations" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium ${isActive ? 'bg-primary/5 text-accent' : 'text-text-main hover:bg-primary/5'}`}>Masterclass</NavLink>
              
              {user ? (
                <Button onClick={() => { setIsMobileMenuOpen(false); navigate('/app'); }} variant="outline" className="w-full mt-4 flex justify-center items-center gap-2">
                  <UserIcon size={18} /> Mon Espace
                </Button>
              ) : (
                <Button onClick={() => { setIsMobileMenuOpen(false); navigate('/devis'); }} variant="primary" className="w-full mt-4">
                  Demander un Devis
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Colonne 1 : Ã€ propos */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/brand/logo_cropped.png" alt="Logo RÉVOLUTION GROUP" className="w-10 h-10 object-contain" />
                <span className="font-bold text-lg text-white tracking-wide">RÉVOLUTION GROUP</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Expertise globale en ingénierie, architecture, BTP et formation professionnelle. Nous concevons et réalisons vos projets avec excellence.
              </p>
            </div>

            {/* Colonne 2 : Liens Rapides */}
            <div className="md:col-span-1">
              <h3 className="text-accent font-semibold mb-6">Liens Rapides</h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} /> Accueil</Link></li>
                <li><Link to="/chantiers" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} /> Nos Réalisations</Link></li>
                <li><Link to="/formations" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} /> Formations Masterclass</Link></li>
                <li><Link to="/devis" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} /> Demander un Devis</Link></li>
              </ul>
            </div>

            {/* Colonne 3 : Services */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-6">Nos Domaines</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><ChevronRight size={14} /> Architecture & Design</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} /> Construction & BTP</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} /> Études & Métré</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} /> Consulting d'Ingénierie</li>
              </ul>
            </div>

            {/* Colonne 4 : Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-6">Contactez-nous</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>Cameroun<br/>Siège social</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span>+237 670 86 50 04</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-accent shrink-0" />
                  <span>contact@revolution-group.com</span>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} RÉVOLUTION GROUP. Tous droits réservés.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/app" className="hover:text-accent transition-colors">Portail Collaborateur</Link>
              <Link to="#" className="hover:text-accent transition-colors">Mentions Légales</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
