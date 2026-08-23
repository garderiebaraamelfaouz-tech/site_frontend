import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, Check, X, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const PRIMARY = '#2ECC71';
const NAVY = '#0F2C59';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const CLASS_LEVELS = ['All', 'Préparatoire', 'Primaire', 'Collège', 'Lycée'];
const STATUSES = ['All', 'Pending', 'Confirmed', 'Cancelled'];

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function StudentsAdmin() {
  const { t } = useTranslation();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [localSearch, setLocalSearch] = useState('');

  const fetchStudents = async (classLevel, status, search) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (classLevel && classLevel !== 'All') params.append('classLevel', classLevel);
      if (status && status !== 'All') params.append('status', status);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await api.get(`/students?${params.toString()}`);
      setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(classFilter, statusFilter, searchTerm);
  }, [classFilter, statusFilter, searchTerm]);

  const debouncedSetSearch = debounce((val) => {
    setSearchTerm(val);
  }, 400);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSetSearch(val);
  };

  const handleClassFilterChange = (e) => {
    setClassFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleConfirm = async (id) => {
    try {
      await api.patch(`/students/${id}`, { status: 'Confirmed' });
      setStudents((prev) =>
        prev.map((s) => (s._id === id || s.id === id ? { ...s, status: 'Confirmed' } : s))
      );
    } catch (err) {
      console.error('Failed to confirm student:', err);
      alert('Failed to confirm student');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.patch(`/students/${id}`, { status: 'Cancelled' });
      setStudents((prev) =>
        prev.map((s) => (s._id === id || s.id === id ? { ...s, status: 'Cancelled' } : s))
      );
    } catch (err) {
      console.error('Failed to cancel student:', err);
      alert('Failed to cancel student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
    } catch (err) {
      console.error('Failed to delete student:', err);
      alert('Failed to delete student');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const exportCSV = () => {
    if (!students.length) return;

    const headers = [
      'Student Name',
      'Birth Date',
      'Class Level',
      'Parent Name',
      'Phone',
      'Selected Pack',
      'Status',
    ];

    const rows = students.map((s) => [
      s.fullName || '',
      s.birthDate ? formatDate(s.birthDate) : '',
      s.classLevel || '',
      s.parentName || s.parent?.name || '',
      s.phone || s.parent?.phone || '',
      s.selectedPack || s.pack || '',
      s.status || '',
    ]);

    const csvContent =
      '\uFEFF' +
      headers.join(',') +
      '\n' +
      rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="card bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            {t('admin.students', 'Students Management')}
          </h1>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: PRIMARY }}
          >
            <Download size={18} />
            {t('admin.export', 'Export CSV')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder={`${t('admin.studentName', 'Student name')} / ${t('admin.parentName', 'Parent name')} / ${t('admin.phone', 'Phone')}`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRingColor: PRIMARY }}
            />
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={classFilter}
              onChange={handleClassFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 cursor-pointer min-w-[180px]"
            >
              {CLASS_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level === 'All' ? t('admin.all', 'All') : level}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 cursor-pointer min-w-[180px]"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? t('admin.all', 'All') : status}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${PRIMARY} transparent ${PRIMARY} ${PRIMARY}` }}
            ></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr style={{ backgroundColor: NAVY }}>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.studentName', 'Student Name')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.birthDate', 'Birth Date')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.level', 'Class Level')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.parentName', 'Parent Name')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.phone', 'Phone')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.pack', 'Pack')}
                  </th>
                  <th className="px-4 py-3 text-left text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.status', 'Status')}
                  </th>
                  <th className="px-4 py-3 text-center text-white font-semibold text-sm whitespace-nowrap">
                    {t('admin.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const studentId = student._id || student.id;
                  return (
                    <tr
                      key={studentId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(student.birthDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {student.classLevel}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {student.parentName || student.parent?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {student.phone || student.parent?.phone || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {student.selectedPack || student.pack || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[student.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {student.status !== 'Confirmed' && (
                            <button
                              onClick={() => handleConfirm(studentId)}
                              className="p-1.5 rounded-lg text-white transition-colors hover:opacity-80"
                              style={{ backgroundColor: PRIMARY }}
                              title={t('admin.confirm', 'Confirm')}
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {student.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancel(studentId)}
                              className="p-1.5 rounded-lg text-white bg-yellow-500 transition-colors hover:bg-yellow-600"
                              title={t('admin.cancel', 'Cancel')}
                            >
                              <X size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(studentId)}
                            className="p-1.5 rounded-lg text-white bg-red-500 transition-colors hover:bg-red-600"
                            title={t('admin.delete', 'Delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && students.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-right">
            {students.length} student{students.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    </div>
  );
}
