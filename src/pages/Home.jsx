import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Users,
  Heart,
  Apple,
  Star,
  Crown,
  ChevronRight,
  GraduationCap,
  Book,
  Calculator,
  Theater,
  Trophy,
  Languages,
} from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [config, setConfig] = useState({});

  useEffect(() => {
    api
      .get('/config')
      .then((res) => {
        setConfig(res.data || {});
      })
      .catch(() => {});
  }, []);

  const heroBg = config.heroBgImage || '';
  const welcomeDesc = isAr
    ? config.welcomeDescriptionAr || t('hero.description')
    : config.welcomeDescriptionFr || t('hero.description');

  const services = [
    { key: 'followUp', icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { key: 'clubs', icon: Users, color: 'bg-secondary/10 text-secondary' },
    { key: 'care', icon: Heart, color: 'bg-red-100 text-red-500' },
    { key: 'meals', icon: Apple, color: 'bg-orange-100 text-orange-500' },
  ];

  const clubsList = [
    { key: 'quran', icon: Book, color: 'bg-primary text-white' },
    { key: 'mentalMath', icon: Calculator, color: 'bg-secondary text-navy' },
    { key: 'theater', icon: Theater, color: 'bg-purple-500 text-white' },
    { key: 'chess', icon: Trophy, color: 'bg-navy text-white' },
    { key: 'french', icon: Languages, color: 'bg-blue-500 text-white' },
    { key: 'english', icon: Languages, color: 'bg-indigo-500 text-white' },
  ];

  const packs = [
    {
      level: 'preparatoire',
      variant: t('services.followUp'),
      priceFrom: 50,
      priceTo: 80,
      hours: '8h-12h / 14h30-17h',
      gradient: 'from-primary-400 to-primary-600',
    },
    {
      level: 'preparatoire',
      variant: t('packs.fullDay'),
      priceFrom: 60,
      priceTo: 90,
      hours: '8h-17h',
      gradient: 'from-primary-500 to-emerald-600',
    },
    {
      level: 'preparatoire',
      variant: t('packs.extended'),
      priceFrom: 70,
      priceTo: 100,
      hours: '7h-19h',
      gradient: 'from-primary-600 to-teal-600',
    },
    {
      level: 'primaire',
      variant: t('packs.fullDay'),
      priceFrom: 60,
      priceTo: 120,
      hours: '8h-17h',
      gradient: 'from-secondary-400 to-amber-500',
    },
    {
      level: 'primaire',
      variant: t('packs.extended'),
      priceFrom: 80,
      priceTo: 140,
      hours: '7h-19h',
      gradient: 'from-secondary-500 to-orange-500',
    },
    {
      level: 'collegeLycee',
      variant: '',
      priceFrom: 70,
      priceTo: 150,
      hours: '12 days / 2h daily',
      gradient: 'from-navy-400 to-navy-600',
    },
    {
      level: 'nightCare',
      variant: t('packs.perNight'),
      priceFrom: 15,
      priceTo: 20,
      hours: '',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      level: 'nightCare',
      variant: t('packs.monthly'),
      priceFrom: 300,
      priceTo: 450,
      hours: '',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const vipPack = {
    price: 280,
    hours: 'Mon-Sat 7h-20h + 4 Night Care Stays',
    features: ['breakfast', 'dinner', 'clubs', 'lessons', 'nightStays'],
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: heroBg ? `url(${heroBg})` : 'linear-gradient(135deg, #0F2C59 0%, #1a4b91 50%, #2ECC71 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 leading-tight">
              <span className="text-primary">{t('hero.title').split(' ')[0]}</span>{' '}
              <span className="text-secondary">{t('hero.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-6">
              {t('hero.subtitle')}
            </p>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {welcomeDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg flex items-center gap-2 group">
              {t('hero.cta')}
              <ChevronRight
                size={20}
                className={`transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180' : ''}`}
              />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-all duration-300 text-lg"
            >
              {isAr ? 'من نحن' : 'À Propos'}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight size={32} className="text-white/50 rotate-90" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('services.title')}</h2>
            <p className="section-subtitle">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.key} className="card p-8 text-center group hover:-translate-y-2">
                  <div
                    className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{t(`services.${service.key}`)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(`services.${service.key}Desc`)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-navy text-center mb-8">
              {isAr ? 'نوادٍنا التعليمية' : 'Nos Clubs Éducatifs'}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {clubsList.map((club) => {
                const Icon = club.icon;
                return (
                  <div
                    key={club.key}
                    className={`${club.color} px-5 py-2.5 rounded-full flex items-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105`}
                  >
                    <Icon size={18} />
                    {t(`clubs.${club.key}`)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Packs & Pricing Section */}
      <section id="packs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('packs.title')}</h2>
            <p className="section-subtitle">{t('packs.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack, index) => (
              <div key={index} className="card overflow-hidden group hover:-translate-y-1">
                <div className={`bg-gradient-to-r ${pack.gradient} p-5 text-white`}>
                  <p className="text-sm font-medium opacity-90">{t(`packs.${pack.level}`)}</p>
                  {pack.variant && (
                    <p className="text-lg font-bold mt-1">{pack.variant}</p>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-extrabold text-navy">{pack.priceFrom}</span>
                    <span className="text-sm text-gray-500">{t('packs.currency')}</span>
                    {pack.priceTo !== pack.priceFrom && (
                      <>
                        <span className="text-gray-400">-</span>
                        <span className="text-xl font-bold text-navy">{pack.priceTo}</span>
                        <span className="text-sm text-gray-500">{t('packs.currency')}</span>
                      </>
                    )}
                  </div>
                  {pack.hours && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="text-primary">⏱</span> {pack.hours}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* VIP Pack */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative card overflow-hidden border-2 border-secondary">
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-secondary text-navy px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                  <Crown size={14} />
                  VIP
                </div>
              </div>
              <div className="bg-gradient-to-r from-navy-600 via-navy to-primary p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Crown size={28} className="text-secondary" />
                  <h3 className="text-2xl font-extrabold">{t('packs.vip')}</h3>
                </div>
                <p className="text-white/80 text-sm">{vipPack.hours}</p>
              </div>
              <div className="p-8">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-navy">{vipPack.price}</span>
                  <span className="text-lg text-gray-500">{t('packs.currency')}</span>
                  <span className="text-sm text-gray-400 ml-2">{t('packs.monthly')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vipPack.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 bg-primary/5 rounded-xl px-4 py-3"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star size={16} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-navy">
                        {t(`packs.features.${feature}`)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
                    {t('hero.cta')}
                    <ChevronRight
                      size={20}
                      className={`transition-transform ${isAr ? 'rotate-180' : ''}`}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <GraduationCap size={40} className="text-secondary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            {isAr ? 'سجّل طفلك اليوم!' : "Inscrivez votre enfant aujourd'hui!"}
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'لا تفوت الفرصة! سجّل طفلك في حضانة براعم الفوز واكتشف مستقبلًا تعليميًا مشرقًا.'
              : "N'attendez plus ! Inscrivez votre enfant à Baraam El Fawz et offrez-lui un avenir éducatif brillant."}
          </p>
          <Link
            to="/register"
            className="btn-secondary text-lg inline-flex items-center gap-2 group"
          >
            {t('hero.cta')}
            <ChevronRight
              size={20}
              className={`transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180' : ''}`}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
