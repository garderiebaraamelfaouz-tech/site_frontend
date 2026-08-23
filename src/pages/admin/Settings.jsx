import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image, Save, UserPlus, Key, CheckCircle, AlertCircle,
  Upload, X, Loader2, CloudUpload
} from 'lucide-react';
import api from '../../services/api';

export default function Settings() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [config, setConfig] = useState({
    heroBgImage: '',
    heroBgPublicId: '',
    welcomeDescriptionAr: '',
    welcomeDescriptionFr: '',
    contactPhone: '',
    contactAddress: '',
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [configSuccess, setConfigSuccess] = useState('');
  const [configError, setConfigError] = useState('');

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminError, setAdminError] = useState('');

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config.heroBgImage) {
      setPreviewUrl(config.heroBgImage);
    }
  }, [config.heroBgImage]);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/config');
      setConfig({
        heroBgImage: data.heroBgImage || '',
        heroBgPublicId: data.heroBgPublicId || '',
        welcomeDescriptionAr: data.welcomeDescriptionAr || '',
        welcomeDescriptionFr: data.welcomeDescriptionFr || '',
        contactPhone: data.contactPhone || '',
        contactAddress: data.contactAddress || '',
      });
      if (data.heroBgImage) {
        setPreviewUrl(data.heroBgImage);
      }
    } catch (err) {
      setConfigError(err.response?.data?.message || 'Failed to load config');
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadLoading(true);
    setUploadError('');
    setUploadProgress(0);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { data } = await api.post('/config/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setConfig((prev) => ({
        ...prev,
        heroBgImage: data.heroBgImage,
        heroBgPublicId: data.heroBgPublicId,
      }));
      setPreviewUrl(data.heroBgImage);

      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
      setPreviewUrl(config.heroBgImage || '');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setConfig((prev) => ({
      ...prev,
      heroBgImage: '',
      heroBgPublicId: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfigSave = async (e) => {
    e.preventDefault();
    setConfigLoading(true);
    setConfigSuccess('');
    setConfigError('');
    try {
      await api.put('/config', config);
      setConfigSuccess(t('admin.settingsUpdated'));
    } catch (err) {
      setConfigError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminSuccess('');
    setAdminError('');
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/auth/register',
        { username: newAdmin.username, password: newAdmin.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminSuccess('Admin created successfully');
      setNewAdmin({ username: '', password: '' });
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordSuccess('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm';
  const textareaClass = inputClass + ' min-h-[100px] resize-y';
  const labelClass = 'block mb-2 font-semibold text-navy text-sm';
  const alertSuccess = 'flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-sm';
  const alertError = 'flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm';
  const cardClass = 'bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6';
  const sectionTitle = 'flex items-center gap-3 text-navy text-xl font-bold mb-6';

  return (
    <div className="p-4 md:p-8 max-w-[900px] mx-auto">
      <h1 className="text-navy text-3xl font-bold mb-8">{t('admin.settings')}</h1>

      {/* CMS Settings */}
      <div className={cardClass}>
        <h2 className={sectionTitle}>
          <Image size={22} className="text-primary" />
          {t('admin.settings')}
        </h2>

        {configSuccess && (
          <div className={alertSuccess}>
            <CheckCircle size={18} /> {configSuccess}
          </div>
        )}
        {configError && (
          <div className={alertError}>
            <AlertCircle size={18} /> {configError}
          </div>
        )}

        <form onSubmit={handleConfigSave}>
          {/* Hero Image Upload Zone */}
          <div className="mb-6">
            <label className={labelClass}>{t('admin.heroImage')}</label>

            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Hero background"
                    className="w-full h-48 md:h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-navy px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100"
                      >
                        <Upload size={16} /> Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-red-600"
                      >
                        <X size={16} /> Remove
                      </button>
                    </div>
                  </div>
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
                      <Loader2 size={40} className="text-primary animate-spin mb-3" />
                      <span className="text-white text-sm font-medium">
                        Uploading... {uploadProgress}%
                      </span>
                      <div className="w-48 h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="p-8 md:p-12 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="text-navy font-semibold mb-2">
                    {isDragging ? 'Drop image here' : 'Drag & drop hero background image'}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">or click to browse</p>
                  <p className="text-gray-400 text-xs">Supports: JPG, PNG, WebP, GIF (max 10MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle size={14} /> {uploadError}
              </div>
            )}
          </div>

          <div className="mb-5">
            <label className={labelClass}>{t('admin.welcomeDescAr')}</label>
            <textarea
              className={textareaClass}
              value={config.welcomeDescriptionAr}
              onChange={(e) => setConfig({ ...config, welcomeDescriptionAr: e.target.value })}
              dir="rtl"
            />
          </div>

          <div className="mb-5">
            <label className={labelClass}>{t('admin.welcomeDescFr')}</label>
            <textarea
              className={textareaClass}
              value={config.welcomeDescriptionFr}
              onChange={(e) => setConfig({ ...config, welcomeDescriptionFr: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>{t('admin.contactPhone')}</label>
              <input
                type="text"
                className={inputClass}
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.contactAddress')}</label>
              <input
                type="text"
                className={inputClass}
                value={config.contactAddress}
                onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ${configLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={configLoading}
          >
            <Save size={18} />
            {configLoading ? '...' : t('admin.saveSettings')}
          </button>
        </form>
      </div>

      {/* Admin Management */}
      <div className={cardClass}>
        <h2 className={sectionTitle}>
          <UserPlus size={22} className="text-primary" />
          {t('admin.addAdmin')}
        </h2>

        {adminSuccess && (
          <div className={alertSuccess}>
            <CheckCircle size={18} /> {adminSuccess}
          </div>
        )}
        {adminError && (
          <div className={alertError}>
            <AlertCircle size={18} /> {adminError}
          </div>
        )}

        <form onSubmit={handleCreateAdmin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>{t('admin.newUsername')}</label>
              <input
                type="text"
                className={inputClass}
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.newPassword')}</label>
              <input
                type="password"
                className={inputClass}
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ${adminLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={adminLoading}
          >
            <UserPlus size={18} />
            {adminLoading ? '...' : t('admin.createAdmin')}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className={cardClass}>
        <h2 className={sectionTitle}>
          <Key size={22} className="text-primary" />
          {t('admin.changePassword')}
        </h2>

        {passwordSuccess && (
          <div className={alertSuccess}>
            <CheckCircle size={18} /> {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className={alertError}>
            <AlertCircle size={18} /> {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>{t('admin.currentPassword')}</label>
              <input
                type="password"
                className={inputClass}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.newPassword')}</label>
              <input
                type="password"
                className={inputClass}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 ${passwordLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={passwordLoading}
          >
            <Key size={18} />
            {passwordLoading ? '...' : t('admin.updatePassword')}
          </button>
        </form>
      </div>
    </div>
  );
}
