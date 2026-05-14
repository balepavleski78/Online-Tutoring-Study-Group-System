import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';

export default function StudyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [userMemberships, setUserMemberships] = useState(new Set());
  const [form, setForm] = useState({ title: '', subject_id: '', description: '', meeting_date: '', location_or_link: '' });
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(null);
  const [groupMembers, setGroupMembers] = useState({});

  const loadData = async () => {
    try {
      const [groupsRes, subjectsRes] = await Promise.all([api.get('/study-groups'), api.get('/subjects')]);
      setGroups(groupsRes.data);
      setSubjects(subjectsRes.data);
      
      const memberships = new Set();
      groupsRes.data.forEach((group) => {
        if (group.members && group.members.some((member) => member.student_id === user?.id)) {
          memberships.add(group.id);
        }
      });
      setUserMemberships(memberships);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const joinGroup = async (groupId) => {
    try {
      setLoading(true);
      await api.post(`/study-groups/${groupId}/join`);
      setUserMemberships((prev) => new Set([...prev, groupId]));
      setGroups((prev) => prev.map((group) => 
        group.id === groupId ? { ...group, member_count: group.member_count + 1 } : group
      ));
      setMessage('Joined group successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to join group');
    } finally {
      setLoading(false);
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await api.get(`/study-groups/${groupId}/members`);
      setGroupMembers((prev) => ({ ...prev, [groupId]: response.data }));
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const removeMember = async (groupId, memberId) => {
    if (!confirm('Are you sure you want to remove this member from the study group?')) return;
    try {
      await api.delete(`/study-groups/${groupId}/members/${memberId}`);
      setGroupMembers((prev) => ({
        ...prev,
        [groupId]: prev[groupId].filter((member) => member.student_id !== memberId)
      }));
      setGroups((prev) => prev.map((group) => 
        group.id === groupId ? { ...group, member_count: Math.max(0, group.member_count - 1) } : group
      ));
      setMessage('Member removed successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to remove member');
    }
  };

  const leaveGroup = async (groupId) => {
    if (!confirm('Are you sure you want to leave this study group?')) return;
    try {
      setLoading(true);
      await api.post(`/study-groups/${groupId}/leave`);
      setUserMemberships((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
      setGroups((prev) => prev.map((group) => 
        group.id === groupId ? { ...group, member_count: Math.max(0, group.member_count - 1) } : group
      ));
      setMessage('Left group successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to leave group');
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId) => {
    if (!confirm('Are you sure you want to delete this study group?')) return;
    try {
      setLoading(true);
      await api.delete(`/study-groups/${groupId}`);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      setUserMemberships((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
      setMessage('Study group deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete group');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/study-groups', form);
      setGroups((prev) => [...prev, { ...response.data, members: [{ student_id: user.id }] }]);
      setUserMemberships((prev) => new Set([...prev, response.data.id]));
      setForm({ title: '', subject_id: '', description: '', meeting_date: '', location_or_link: '' });
      setMessage('Study group created.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Study groups</p>
          <h2 className="text-3xl font-semibold text-slate-900">Connect with peers</h2>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {message && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">{message}</div>}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="text-xl font-semibold text-slate-900">Create a study group</h3>
          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <select
              value={form.subject_id}
              onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              rows="4"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <input
              type="date"
              value={form.meeting_date}
              onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <input
              value={form.location_or_link}
              onChange={(e) => setForm({ ...form, location_or_link: e.target.value })}
              placeholder="Location or link"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <button className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-500">Create group</button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Available groups</h3>
            <div className="mt-5 space-y-4">
              {groups.length ? (
                groups.map((group) => (
                  <article key={group.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">{group.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{group.subject_name} • {formatDate(group.meeting_date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{group.member_count} members</span>
                        {(user?.id === group.created_by || user?.role === 'admin') && (
                          <button
                            onClick={() => {
                              if (showMembers === group.id) {
                                setShowMembers(null);
                              } else {
                                setShowMembers(group.id);
                                loadGroupMembers(group.id);
                              }
                            }}
                            className="rounded-2xl bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300"
                          >
                            {showMembers === group.id ? 'Hide Members' : 'Show Members'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-slate-600">{group.description}</p>
                    <p className="mt-2 text-slate-500">Created by {group.creator_name}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {userMemberships.has(group.id) ? (
                        <button
                          onClick={() => leaveGroup(group.id)}
                          disabled={loading}
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Leave group
                        </button>
                      ) : (
                        <button
                          onClick={() => joinGroup(group.id)}
                          disabled={loading}
                          className="rounded-2xl bg-brand-600 px-4 py-2 text-sm text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Join group
                        </button>
                      )}
                      {(user?.id === group.created_by || user?.role === 'admin') && (
                        <button
                          onClick={() => deleteGroup(group.id)}
                          className="rounded-2xl bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                          Delete Group
                        </button>
                      )}
                    </div>
                    {showMembers === group.id && groupMembers[group.id] && (
                      <div className="mt-4 rounded-2xl bg-white p-4">
                        <h5 className="font-semibold text-slate-900">Group Members:</h5>
                        <ul className="mt-2 space-y-2">
                          {groupMembers[group.id].map((member) => (
                            <li key={member.student_id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                              <span className="text-sm text-slate-700">{member.username}</span>
                              {(user?.id === group.created_by || user?.role === 'admin') && member.student_id !== user?.id && (
                                <button
                                  onClick={() => removeMember(group.id, member.student_id)}
                                  className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-slate-500">No study groups available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
