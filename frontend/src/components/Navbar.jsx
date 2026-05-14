import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tutoring & Study Groups</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.username}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{user?.role}</span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-full bg-brand-600 px-4 py-2 text-white hover:bg-brand-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
