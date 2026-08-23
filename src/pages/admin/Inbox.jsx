import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MailOpen,
  Trash2,
  ArrowLeft,
  User,
  Phone,
  Clock,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api';

const Inbox = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sorted);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setActionLoading(true);
    try {
      await api.patch(`/contacts/${id}/read`);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage((prev) => ({ ...prev, read: true }));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete', 'Are you sure you want to delete this message?'))) {
      return;
    }
    setActionLoading(true);
    try {
      await api.delete(`/contacts/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPreview = (message) => {
    if (!message.message) return '';
    return message.message.length > 100
      ? message.message.substring(0, 100) + '...'
      : message.message;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-4 rounded-full" style={{ borderTopColor: '#2ECC71' }} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#0F2C5910' }}>
          <Mail className="w-12 h-12" style={{ color: '#0F2C59' }} />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">{t('admin.inbox')}</h2>
        <p className="text-gray-500 text-lg">{t('admin.noMessages')}</p>
      </div>
    );
  }

  return (
    <div>
      <section className="py-10 md:py-16" style={{ background: 'linear-gradient(135deg, #0F2C59 0%, #1a3a6e 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('admin.inbox')}</h1>
          <p className="text-gray-300">
            {messages.filter((m) => !m.read).length > 0
              ? `${messages.filter((m) => !m.read).length} unread`
              : messages.length}{' '}
            {messages.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="card overflow-hidden">
            {/* Desktop: split view */}
            <div className="hidden md:flex min-h-[600px]">
              {/* Message list */}
              <div className="w-96 border-r border-gray-200 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage?._id === message._id ? 'bg-gray-100' : ''
                    } ${!message.read ? 'bg-blue-50/60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F2C59' }}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                        {!message.read && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm truncate ${!message.read ? 'font-bold text-navy' : 'font-medium text-gray-700'}`}>
                            {message.name}
                          </h3>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1">{message.phone}</p>
                        <p className={`text-sm truncate ${!message.read ? 'text-gray-700' : 'text-gray-500'}`}>
                          {getPreview(message)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail panel */}
              <div className="flex-1 overflow-y-auto">
                {selectedMessage ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-navy">{selectedMessage.name}</h2>
                      <div className="flex items-center gap-2">
                        {!selectedMessage.read && (
                          <button
                            onClick={() => handleMarkAsRead(selectedMessage._id)}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#2ECC71' }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('admin.markAsRead')}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(selectedMessage._id)}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('admin.delete')}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">{t('studentName')}</p>
                          <p className="font-medium text-navy">{selectedMessage.name}</p>
                        </div>
                      </div>

                      {selectedMessage.email && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">{t('contact.email')}</p>
                            <p className="font-medium text-navy">{selectedMessage.email}</p>
                          </div>
                        </div>
                      )}

                      {selectedMessage.phone && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">{t('contact.phone')}</p>
                            <p className="font-medium text-navy">{selectedMessage.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium text-navy">
                            {new Date(selectedMessage.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">{t('contact.message')}</p>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center h-full text-gray-400 p-8">
                    <MailOpen className="w-16 h-16 mb-4 opacity-40" />
                    <p className="text-lg">Select a message to read</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: list or detail */}
            <div className="md:hidden">
              {selectedMessage ? (
                <div className="p-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-2 text-sm font-medium mb-4 transition-colors"
                    style={{ color: '#2ECC71' }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('admin.inbox')}
                  </button>

                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-navy">{selectedMessage.name}</h2>
                    <div className="flex items-center gap-2">
                      {!selectedMessage.read && (
                        <button
                          onClick={() => handleMarkAsRead(selectedMessage._id)}
                          disabled={actionLoading}
                          className="p-2 rounded-lg text-white transition-colors disabled:opacity-50"
                          style={{ backgroundColor: '#2ECC71' }}
                          title={t('admin.markAsRead')}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedMessage._id)}
                        disabled={actionLoading}
                        className="p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                        title={t('admin.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{t('studentName')}</p>
                        <p className="text-sm font-medium text-navy">{selectedMessage.name}</p>
                      </div>
                    </div>

                    {selectedMessage.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">{t('contact.email')}</p>
                          <p className="text-sm font-medium text-navy">{selectedMessage.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedMessage.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">{t('contact.phone')}</p>
                          <p className="text-sm font-medium text-navy">{selectedMessage.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium text-navy">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{t('contact.message')}</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        !message.read ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F2C59' }}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          {!message.read && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm truncate ${!message.read ? 'font-bold text-navy' : 'font-medium text-gray-700'}`}>
                              {message.name}
                            </h3>
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1">{message.phone}</p>
                          <p className={`text-sm truncate ${!message.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {getPreview(message)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inbox;
