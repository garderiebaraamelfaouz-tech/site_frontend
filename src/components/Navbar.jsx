import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Languages, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/#packs', label: t('nav.packs') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/register', label: t('nav.register') },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Baraam El Fawz" className="w-12 h-12 rounded-full object-cover" />
              <div className="hidden sm:block">
                <h1 className="text-navy font-bold text-lg leading-tight">{t('hero.title')}</h1>
                <p className="text-xs text-gray-500">Baraam El Faouz</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to.startsWith('/#') ? '/' : link.to}
                  onClick={() => {
                    if (link.to.startsWith('/#')) {
                      setTimeout(() => {
                        document.getElementById('packs')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-navy hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-navy"
              >
                <Languages size={18} />
                {i18n.language === 'ar' ? 'FR' : 'عربي'}
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-2 btn-primary text-sm !py-2 !px-5"
                  >
                    <Shield size={16} />
                    {t('nav.admin')}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    {t('admin.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden sm:flex items-center gap-2 btn-outline text-sm !py-2 !px-5"
                >
                  <Shield size={16} />
                  {t('admin.dashboard')}
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-navy"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t bg-white px-4 pb-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to.startsWith('/#') ? '/' : link.to}
                onClick={() => {
                  setIsOpen(false);
                  if (link.to.startsWith('/#')) {
                    setTimeout(() => {
                      document.getElementById('packs')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="block py-3 px-4 text-navy hover:bg-primary/5 rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            {!isAdmin && (
              <button
                onClick={() => { setShowLogin(true); setIsOpen(false); }}
                className="w-full mt-3 btn-outline text-sm"
              >
                {t('admin.dashboard')}
              </button>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block mt-3 btn-primary text-center text-sm"
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
