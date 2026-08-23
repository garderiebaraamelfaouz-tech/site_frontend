import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({});

  useEffect(() => {
    api.get('/config').then((res) => setConfig(res.data || {})).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #0F2C59 0%, #1a3a6e 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8">
              <h2 className="section-title text-2xl mb-6">{t('contact.title')}</h2>

              {success && (
                <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{t('contact.success')}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder={t('contact.name')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder={t('contact.email')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder={t('contact.phone')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field w-full resize-none"
                    placeholder={t('contact.message')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2 w-full"
                  style={{ backgroundColor: '#2ECC71' }}
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {t('contact.submit')}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F2C59' }}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.phoneLabel')}</h3>
                  <p className="text-gray-600">{config.contactPhone || '+216 XX XXX XXX'}</p>
                </div>
              </div>

              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F2C59' }}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.addressLabel')}</h3>
                  <p className="text-gray-600">{config.contactAddress || 'Tunis, Tunisia'}</p>
                </div>
              </div>

              <div className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F2C59' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.emailLabel')}</h3>
                  <p className="text-gray-600">garderiebaraamelfaouz@gmail.com</p>
                </div>
              </div>

              <div className="card overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.6037474329523!2d10.9881719!3d33.822537499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13aa97ebc7d4edaf%3A0x18b1529c29dba0b5!2sRXFQ%2B277%2C%20Djerba%20Midun!5e0!3m2!1sfr!2stn!4v1787495146740!5m2!1sfr!2stn"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Baraam El Fawz Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
