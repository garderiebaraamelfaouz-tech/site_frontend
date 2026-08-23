import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPack, setSelectedPack] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFullName('');
    setBirthDate('');
    setClassLevel('');
    setParentName('');
    setPhone('');
    setEmail('');
    setSelectedPack('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await api.post('/students', {
        fullName,
        birthDate,
        classLevel,
        parentName,
        phone,
        email,
        selectedPack,
      });
      setSuccess(true);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#0F2C59] to-[#1a3f7a] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 section-title">
          {t('register.title')}
        </h1>
        <p className="text-lg text-blue-200 max-w-2xl mx-auto section-subtitle">
          {t('register.subtitle')}
        </p>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-4 relative">
        {/* Desktop Decorative Elements */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2">
          <div className="w-16 h-16 rounded-full bg-[#2ECC71]/10 flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-[#2ECC71]/40" />
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0F2C59]/10 flex items-center justify-center ml-2">
            <User className="w-6 h-6 text-[#0F2C59]/40" />
          </div>
        </div>
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-[#0F2C59]/10 flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-[#0F2C59]/40" />
          </div>
          <div className="w-16 h-16 rounded-full bg-[#2ECC71]/10 flex items-center justify-center ml-2">
            <Mail className="w-8 h-8 text-[#2ECC71]/40" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.birthDate')}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Class Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.classLevel')}
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">{t('register.selectLevel')}</option>
                  <option value="Préparatoire">{t('register.preparatoire')}</option>
                  <option value="Primaire">{t('register.primaire')}</option>
                  <option value="Collège">{t('register.college')}</option>
                  <option value="Lycée">{t('register.lycee')}</option>
                </select>
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.parentName')}
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.phone')}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Selected Pack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline-block mr-2 text-[#0F2C59]" />
                  {t('register.selectedPack')}
                </label>
                <select
                  value={selectedPack}
                  onChange={(e) => setSelectedPack(e.target.value)}
                  className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">{t('register.selectPack')}</option>
                  <option value="Préparatoire">{t('register.preparatoire')}</option>
                  <option value="Primaire">{t('register.primaire')}</option>
                  <option value="Collège">{t('register.college')}</option>
                  <option value="Lycée">{t('register.lycee')}</option>
                  <option value="VIP">VIP</option>
                  <option value="Night Care">Night Care</option>
                  <option value="No Pack">{t('register.noPack')}</option>
                </select>
              </div>

              {/* Success Alert */}
              {success && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{t('register.success')}</span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 bg-[#2ECC71] hover:bg-[#27ae60] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {t('register.submit')}...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('register.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
