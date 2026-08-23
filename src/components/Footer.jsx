import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Mail, Heart } from 'lucide-react';
import api from '../services/api';

export default function Footer() {
  const { t } = useTranslation();
  const [config, setConfig] = useState({});

  useEffect(() => {
    api.get('/config').then((res) => setConfig(res.data || {})).catch(() => {});
  }, []);

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/images/logo.png" alt="Baraam El Fawz" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg">{t('hero.title')}</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-primary text-sm transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-primary text-sm transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-primary text-sm transition-colors">
                {t('nav.contact')}
              </Link>
              <Link to="/register" className="block text-gray-300 hover:text-primary text-sm transition-colors">
                {t('nav.register')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone size={16} className="text-primary shrink-0" />
                <span>{config.contactPhone || '+216 XX XXX XXX'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin size={16} className="text-primary shrink-0" />
                <span>{config.contactAddress || 'Tunis, Tunisia'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail size={16} className="text-primary shrink-0" />
                <span>garderiebaraamelfaouz@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400 text-sm flex items-center justify-center gap-1">
          {t('footer.copyright')}
          <Heart size={14} className="text-primary mx-1" fill="currentColor" />
        </div>
      </div>
    </footer>
  );
}
