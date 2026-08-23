import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onClose();
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="Baraam El Fawz" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy">{t('admin.dashboard')}</h2>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field !pl-10"
                placeholder="admin"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field !pl-10"
                placeholder="••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? '...' : t('admin.dashboard')}
          </button>
        </form>
      </div>
    </div>
  );
}
