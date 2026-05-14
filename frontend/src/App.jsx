import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Tutoring from './pages/Tutoring';
import Bookings from './pages/Bookings';
import TutorDashboard from './pages/TutorDashboard';
import StudyGroups from './pages/StudyGroups';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {user && <Navbar />}
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {user ? (
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <Sidebar />
            <main className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <Routes>
                <Route
                  path="/"
                  element={
                    user?.role === 'admin' ? (
                      <Navigate to="/admin" replace />
                    ) : user?.role === 'tutor' ? (
                      <Navigate to="/tutor-dashboard" replace />
                    ) : (
                      <Home />
                    )
                  }
                />
                <Route path="/tutoring" element={<Tutoring />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/study-groups" element={<StudyGroups />} />
                <Route path="/tutor-dashboard" element={<RequireAuth roles={[ 'tutor' ]}><TutorDashboard /></RequireAuth>} />
                <Route path="/admin" element={<RequireAuth roles={[ 'admin' ]}><AdminDashboard /></RequireAuth>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
