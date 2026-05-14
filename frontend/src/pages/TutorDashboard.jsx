import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';

export default function TutorDashboard() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subject_id: '', date: '', start_time: '', end_time: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBookings, setShowBookings] = useState(null);

  const loadData = async () => {
    try {
      const [slotsRes, bookingsRes, subjectsRes] = await Promise.all([
        api.get('/tutoring-slots'),
        api.get('/bookings/my-bookings'),
        api.get('/subjects'),
      ]);
      const mySlots = slotsRes.data.filter((slot) => slot.tutor_id === user?.id);
      setSlots(mySlots);
      setBookings(bookingsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/tutoring-slots', form);
      setMessage('Slot created successfully.');
      setForm({ subject_id: '', date: '', start_time: '', end_time: '' });
      setTimeout(() => setMessage(''), 3000);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create slot');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      setMessage('Booking ' + status + ' successfully.');
      setTimeout(() => setMessage(''), 3000);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update status');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this tutoring slot? This will also cancel all associated bookings.')) return;
    try {
      setLoading(true);
      await api.delete(`/tutoring-slots/${slotId}`);
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
      setBookings((prev) => prev.filter((booking) => booking.slot_id !== slotId));
      setMessage('Tutoring slot deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete slot');
    } finally {
      setLoading(false);
    }
  };

  const removeBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to remove this booking?')) return;
    try {
      setLoading(true);
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      setMessage('Booking removed successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to remove booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Tutor dashboard</p>
        <h2 className="text-3xl font-semibold text-slate-900">Manage your slots</h2>
      </div>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">{message}</div>}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Create new tutoring slot</h3>
        <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
          <select
            value={form.subject_id}
            onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'Creating...' : 'Create slot'}
          </button>
        </form>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Your tutoring slots</h3>
          {slots.length ? (
            <ul className="mt-5 space-y-4">
              {slots.map((slot) => (
                <li key={slot.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{slot.subject_name}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatDate(slot.date)} • {slot.start_time} - {slot.end_time}</p>
                      <p className="mt-2 text-sm text-slate-600">Status: {slot.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (showBookings === slot.id) {
                            setShowBookings(null);
                          } else {
                            setShowBookings(slot.id);
                          }
                        }}
                        className="rounded-2xl bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300"
                      >
                        {showBookings === slot.id ? 'Hide Bookings' : 'Show Bookings'}
                      </button>
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        disabled={loading}
                        className="rounded-2xl bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {showBookings === slot.id && (
                    <div className="mt-4 rounded-2xl bg-white p-4">
                      <h5 className="font-semibold text-slate-900">Bookings for this slot:</h5>
                      {bookings.filter(b => b.slot_id === slot.id).length ? (
                        <ul className="mt-2 space-y-2">
                          {bookings.filter(b => b.slot_id === slot.id).map((booking) => (
                            <li key={booking.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                              <div>
                                <span className="text-sm font-medium text-slate-700">{booking.student_name}</span>
                                <span className="ml-2 text-xs text-slate-500">({booking.status})</span>
                              </div>
                              {booking.status === 'requested' && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleStatus(booking.id, 'approved')}
                                    disabled={loading}
                                    className="rounded-lg bg-emerald-500 px-2 py-1 text-xs text-white hover:bg-emerald-600 disabled:cursor-not-allowed"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatus(booking.id, 'rejected')}
                                    disabled={loading}
                                    className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:cursor-not-allowed"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              {booking.status === 'approved' && (
                                <button
                                  onClick={() => removeBooking(booking.id)}
                                  disabled={loading}
                                  className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:cursor-not-allowed"
                                >
                                  Remove
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">No bookings for this slot.</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-slate-500">No slots yet.</p>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Booking requests</h3>
          {bookings.filter(b => b.status === 'requested').length ? (
            <ul className="mt-5 space-y-4">
              {bookings.filter(b => b.status === 'requested').map((booking) => (
                <li key={booking.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.subject_name}</p>
                      <p className="mt-1 text-sm text-slate-600">Student: {booking.student_name}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatDate(booking.date)} • {booking.start_time} - {booking.end_time}</p>
                      {booking.request_message && (
                        <p className="mt-2 text-sm text-slate-600">Message: {booking.request_message}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatus(booking.id, 'approved')}
                        disabled={loading}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(booking.id, 'rejected')}
                        disabled={loading}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-slate-500">No pending booking requests.</p>
          )}
        </div>
      </section>
    </div>
  );
}
