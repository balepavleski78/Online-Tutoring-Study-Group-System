import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(form);
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else if (result.user?.role === 'tutor') {
        navigate('/tutor-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-slate-500">Access your tutoring dashboard and manage bookings.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:ring-brand-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:ring-brand-200"
              required
            />
          </div>
          {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account? <Link to="/register" className="text-brand-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
