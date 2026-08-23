import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StudentsAdmin from './pages/admin/StudentsAdmin';
import Inbox from './pages/admin/Inbox';
import Settings from './pages/admin/Settings';

function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary" /></div>;
  return isAdmin ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/students" element={<StudentsAdmin />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
