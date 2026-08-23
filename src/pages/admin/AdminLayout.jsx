import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, Mail, Settings, LogOut, Menu, X, Home, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard },
    { to: '/admin/students', label: t('admin.students'), icon: Users },
    { to: '/admin/inbox', label: t('admin.inbox'), icon: Mail },
    { to: '/admin/settings', label: t('admin.settings'), icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Baraam El Fawz</h1>
            <p className="text-gray-400 text-xs">{t('admin.welcome')}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          {t('admin.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 w-64 bg-navy flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 start-0 w-64 bg-navy flex flex-col z-50 transform transition-transform duration-300">
            <div className="absolute top-4 end-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-navy hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Home size={16} />
              <Link to="/" className="hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <span>/</span>
              <span className="text-navy font-medium">{t('admin.dashboard')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-primary" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-navy">
                {user?.username || user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
