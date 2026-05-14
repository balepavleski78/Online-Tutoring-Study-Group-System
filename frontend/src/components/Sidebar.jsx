import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`;

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Navigation</h2>
        <nav className="mt-4 space-y-2">
          {user?.role === 'admin' ? (
            <NavLink to="/admin" className={linkClass}>Admin Dashboard</NavLink>
          ) : user?.role === 'tutor' ? (
            <NavLink to="/tutor-dashboard" className={linkClass}>Tutor Dashboard</NavLink>
          ) : (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/tutoring" className={linkClass}>Tutoring Sessions</NavLink>
              <NavLink to="/study-groups" className={linkClass}>Study Groups</NavLink>
              <NavLink to="/bookings" className={linkClass}>My Bookings</NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
