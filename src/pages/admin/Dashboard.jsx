import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, CheckCircle, Mail, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [studentStats, setStudentStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    recent: []
  });
  const [contactStats, setContactStats] = useState({ unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentRes, contactRes] = await Promise.all([
          api.get('/students/stats'),
          api.get('/contacts/stats')
        ]);
        setStudentStats(studentRes.data);
        setContactStats(contactRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <AlertCircle size={24} />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertCircle size={24} />
        <span>Error: {error}</span>
      </div>
    );
  }

  const stats = [
    {
      title: t('admin.totalRegistrations'),
      value: studentStats.total,
      icon: <Users size={24} />,
      color: '#2ECC71'
    },
    {
      title: t('admin.pendingApprovals'),
      value: studentStats.pending,
      icon: <Clock size={24} />,
      color: '#F1C40F'
    },
    {
      title: t('admin.confirmed'),
      value: studentStats.confirmed,
      icon: <CheckCircle size={24} />,
      color: '#0F2C59'
    },
    {
      title: t('admin.unreadMessages'),
      value: contactStats.unread,
      icon: <Mail size={24} />,
      color: '#E74C3C'
    }
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      pending: { backgroundColor: '#F1C40F', color: '#000' },
      confirmed: { backgroundColor: '#2ECC71', color: '#fff' },
      cancelled: { backgroundColor: '#E74C3C', color: '#fff' }
    };
    return statusStyles[status?.toLowerCase()] || statusStyles.pending;
  };

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <TrendingUp size={32} />
        <h1>{t('admin.welcome', { name: user?.name || 'Admin' })}</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-registrations card">
        <h2>Recent Registrations</h2>
        {studentStats.recent && studentStats.recent.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('admin.studentName')}</th>
                <th>{t('admin.level')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.date')}</th>
              </tr>
            </thead>
            <tbody>
              {studentStats.recent.slice(0, 5).map((student) => (
                <tr key={student._id}>
                  <td>{student.studentName || `${student.firstName} ${student.lastName}`}</td>
                  <td>{student.level || student.classLevel}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={getStatusStyle(student.status)}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No recent registrations</p>
          </div>
        )}
      </div>

      <style>{`
        .dashboard {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 16px;
          color: #666;
          font-size: 18px;
        }

        .dashboard-error {
          color: #E74C3C;
        }

        .welcome-banner {
          background: linear-gradient(135deg, #0F2C59 0%, #1a3d6d 100%);
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(15, 44, 89, 0.3);
        }

        .welcome-banner h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-content h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .stat-value {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #0F2C59;
        }

        .recent-registrations {
          margin-top: 8px;
        }

        .recent-registrations h2 {
          margin: 0 0 24px 0;
          color: #0F2C59;
          font-size: 20px;
          font-weight: 600;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .data-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #0F2C59;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: #999;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 16px;
          }

          .welcome-banner {
            flex-direction: column;
            text-align: center;
            padding: 24px;
          }

          .welcome-banner h1 {
            font-size: 22px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 28px;
          }

          .data-table {
            font-size: 14px;
          }

          .data-table th,
          .data-table td {
            padding: 12px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;