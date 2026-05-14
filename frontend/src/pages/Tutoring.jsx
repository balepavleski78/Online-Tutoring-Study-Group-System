import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';

export default function Tutoring() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: '', date: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [userBookings, setUserBookings] = useState(new Set());

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, slotsRes, bookingsRes] = await Promise.all([
        api.get('/subjects'), 
        api.get('/tutoring-slots'),
        user?.role === 'student' ? api.get('/bookings/my-bookings') : Promise.resolve({ data: [] })
      ]);
      setSubjects(subjectsRes.data);
      setSlots(slotsRes.data);
      if (user?.role === 'student') {
        const bookingSlotIds = new Set(bookingsRes.data.map(booking => booking.slot_id));
        setUserBookings(bookingSlotIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBooking = async (slotId) => {
    try {
      setActionLoading(slotId);
      await api.post(`/tutoring-slots/${slotId}/book`, { request_message: 'Looking for help.' });
      setUserBookings((prev) => new Set([...prev, slotId]));
      setMessage('Booking request sent successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to book');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = slots.filter((slot) => {
    if (filters.subject && slot.subject_id !== Number(filters.subject)) return false;
    if (filters.date && slot.date !== filters.date) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Tutoring sessions</p>
          <h2 className="text-3xl font-semibold text-slate-900">Find a session</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <select
              value={filters.subject}
              onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">All subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">{message}</div>}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-sm">Loading sessions...</div>
        ) : filtered.length ? (
          filtered.map((slot) => (
            <article key={slot.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{slot.subject_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Tutor: {slot.tutor_name}</p>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-600">{slot.status}</span>
              </div>
              <p className="mt-4 text-slate-600">{formatDate(slot.date)} • {slot.start_time} - {slot.end_time}</p>
              <button
                disabled={user?.role !== 'student' || slot.status !== 'open' || actionLoading === slot.id || userBookings.has(slot.id)}
                onClick={() => handleBooking(slot.id)}
                className="mt-6 inline-flex w-full justify-center rounded-2xl bg-brand-600 px-4 py-3 text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {actionLoading === slot.id ? 'Booking...' : userBookings.has(slot.id) ? 'Requested' : slot.status === 'open' ? 'Request booking' : 'Unavailable'}
              </button>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-sm">No sessions match your filters.</div>
        )}
      </div>
    </div>
  );
}
