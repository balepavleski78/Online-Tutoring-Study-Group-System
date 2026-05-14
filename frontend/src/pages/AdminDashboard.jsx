import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, subjectsRes] = await Promise.all([api.get('/admin/users'), api.get('/subjects')]);
        setUsers(usersRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);

  const createSubject = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/subjects', form);
      setSubjects((prev) => [...prev, response.data]);
      setForm({ name: '', description: '' });
      setMessage('Subject created successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create subject');
    }
  };

  const deleteSubject = async (id) => {
    if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((subject) => subject.id !== id));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Admin panel</p>
        <h2 className="text-3xl font-semibold text-slate-900">Manage platform data</h2>
      </div>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">{message}</div>}
      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">User list</h3>
          <div className="mt-5 space-y-4">
            {users.length ? users.map((user) => (
              <div key={user.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{user.username}</p>
                    <p className="text-sm text-slate-600">{user.email} • {user.role}</p>
                  </div>
                  {(user.role === 'tutor' || user.role === 'student') && (
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this user? This cannot be undone.')) return;
                        try {
                          await api.delete(`/admin/users/${user.id}`);
                          setUsers((prev) => prev.filter((u) => u.id !== user.id));
                        } catch (error) {
                          setMessage(error.response?.data?.message || 'Unable to delete user');
                        }
                      }}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )) : <p className="text-slate-500">No users found.</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Subjects</h3>
          <form onSubmit={createSubject} className="mt-5 space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Subject name"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              rows="3"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <button className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-500">Add subject</button>
          </form>
          <div className="mt-6 space-y-3">
            {subjects.length ? subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{subject.name}</p>
                  <p className="text-sm text-slate-600">{subject.description}</p>
                </div>
                <button onClick={() => deleteSubject(subject.id)} className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Delete</button>
              </div>
            )) : <p className="text-slate-500">No subjects available.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
