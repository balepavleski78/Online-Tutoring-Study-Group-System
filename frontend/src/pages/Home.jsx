import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  const filtered = subjects.filter((subject) => subject.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Welcome</p>
          <h2 className="text-3xl font-semibold text-slate-900">Browse subjects</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:ring-brand-200 sm:w-72"
          />
        </div>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-sm">Loading subjects...</div>
        ) : filtered.length ? (
          filtered.map((subject) => (
            <article key={subject.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{subject.name}</h3>
              <p className="mt-3 text-slate-600">{subject.description}</p>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-sm">No subjects found.</div>
        )}
      </div>
    </div>
  );
}
