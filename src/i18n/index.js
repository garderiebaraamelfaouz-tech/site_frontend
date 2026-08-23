import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import fr from './fr.json';

const savedLang = localStorage.getItem('lang') || 'ar';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: savedLang,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

const setDir = (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

setDir(savedLang);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  setDir(lng);
});

export default i18n;
