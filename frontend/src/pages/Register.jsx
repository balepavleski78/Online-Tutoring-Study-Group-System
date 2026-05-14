import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Registration successful. Please login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-2 text-slate-500">Register as a student, tutor, or admin user.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="text-brand-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
