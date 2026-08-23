import { useTranslation } from 'react-i18next';
import {
  Star,
  Palette,
  Heart,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'students', value: '500+', icon: Users, color: 'bg-primary/10 text-primary' },
    { key: 'years', value: '10+', icon: BookOpen, color: 'bg-secondary/10 text-secondary' },
    { key: 'clubs', value: '6+', icon: Award, color: 'bg-blue-100 text-blue-600' },
    { key: 'success', value: '98%', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
  ];

  const values = [
    { key: 'quality', icon: Star, color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'creativity', icon: Palette, color: 'text-secondary', bg: 'bg-secondary/10' },
    { key: 'inclusion', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const team = [
    { key: 'educators', icon: Users, color: 'text-primary' },
    { key: 'specialists', icon: Sparkles, color: 'text-secondary' },
    { key: 'psychologists', icon: Heart, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-[#0F2C59] via-[#1a3d6e] to-[#0F2C59] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#2ECC71] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F1C40F] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('about.title')}
          </h1>
          <p className="section-subtitle text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Decorative Stats Card */}
            <div className="card relative bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#2ECC71]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#F1C40F]/10 rounded-full blur-2xl" />
              <div className="relative grid grid-cols-2 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.key}
                      className="flex flex-col items-center justify-center p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 group"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-2xl md:text-3xl font-bold text-[#0F2C59]">{stat.value}</span>
                      <span className="text-sm text-gray-500 mt-1">{t(`about.stats.${stat.key}`)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vision Text */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59] mb-6">
                {t('about.vision')}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                {t('about.visionText')}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-[#2ECC71] rounded-full" />
                <div className="w-8 h-1 bg-[#F1C40F] rounded-full" />
                <div className="w-4 h-1 bg-[#0F2C59] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59] mb-4">
              {t('about.values')}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-10 h-1 bg-[#2ECC71] rounded-full" />
              <div className="w-6 h-1 bg-[#F1C40F] rounded-full" />
              <div className="w-10 h-1 bg-[#2ECC71] rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.key}
                  className="card group bg-gray-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${value.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-10 h-10 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F2C59] mb-3">
                    {t(`about.valuesText.${value.key}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(`about.valuesText.${value.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59] mb-4">
              {t('about.team')}
            </h2>
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-10 h-1 bg-[#2ECC71] rounded-full" />
              <div className="w-6 h-1 bg-[#F1C40F] rounded-full" />
              <div className="w-10 h-1 bg-[#2ECC71] rounded-full" />
            </div>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {t('about.teamText')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => {
              const Icon = member.icon;
              return (
                <div
                  key={member.key}
                  className="card bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0F2C59]/5 to-[#0F2C59]/10 flex items-center justify-center mb-6">
                    <Icon className={`w-10 h-10 ${member.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F2C59] mb-3">
                    {t(`about.teamMembers.${member.key}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(`about.teamMembers.${member.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
