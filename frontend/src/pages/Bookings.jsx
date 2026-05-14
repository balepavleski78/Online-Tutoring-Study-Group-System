import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/dateUtils';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-600">My bookings</p>
          <h2 className="text-3xl font-semibold text-slate-900">Booking requests and schedule</h2>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">{message}</div>}
      <div className="grid gap-5">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">Loading bookings...</div>
        ) : bookings.length ? (
          bookings.map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.subject_name}</p>
                  <h3 className="text-xl font-semibold text-slate-900">{formatDate(item.date)} • {item.start_time} - {item.end_time}</h3>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm uppercase tracking-[0.15em] text-slate-600">{item.status}</span>
              </div>
              <p className="mt-3 text-slate-500">Tutor / Student: {item.tutor_name || item.student_name}</p>
              <p className="mt-2 text-slate-600">Message: {item.request_message || 'No message provided.'}</p>
            </article>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">No bookings available yet.</div>
        )}
      </div>
    </div>
  );
}
