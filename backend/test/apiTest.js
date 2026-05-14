const axios = require('axios');

const API = axios.create({ baseURL: 'http://localhost:5000/api', timeout: 10000 });

async function run() {
  console.log('Starting API smoke tests...');

  try {
    const admin = { username: 'adminuser', email: 'admin@example.com', password: 'Admin123!', role: 'admin' };
    const tutor = { username: 'tutoruser', email: 'tutor@example.com', password: 'Tutor123!', role: 'tutor' };
    const student = { username: 'studentuser', email: 'student@example.com', password: 'Student123!', role: 'student' };

    for (const user of [admin, tutor, student]) {
      await API.post('/auth/register', user).catch(() => {});
    }

    const login = async (credentials) => {
      const response = await API.post('/auth/login', credentials);
      return response.data.token;
    };

    const adminToken = await login({ email: admin.email, password: admin.password });
    const tutorToken = await login({ email: tutor.email, password: tutor.password });
    const studentToken = await login({ email: student.email, password: student.password });

    const subjectsRes = await API.get('/subjects');
    console.log('Subjects loaded:', subjectsRes.data.length);

    const newSubject = await API.post('/subjects', { name: 'Biology', description: 'Life science tutoring' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('Created subject', newSubject.data.id);

    const slotsRes = await API.get('/tutoring-slots');
    console.log('Tutoring slots loaded:', slotsRes.data.length);

    const slot = await API.post(
      '/tutoring-slots',
      { subject_id: 1, date: '2026-06-01', start_time: '10:00', end_time: '11:00' },
      { headers: { Authorization: `Bearer ${tutorToken}` } }
    );
    console.log('Created slot', slot.data.id);

    const booking = await API.post(`/tutoring-slots/${slot.data.id}/book`, { request_message: 'I need help with exam prep' }, { headers: { Authorization: `Bearer ${studentToken}` } });
    console.log('Booking request created');

    const bookings = await API.get('/bookings/my-bookings', { headers: { Authorization: `Bearer ${studentToken}` } });
    console.log('Student bookings count:', bookings.data.length);

    console.log('All smoke tests passed');
  } catch (error) {
    if (error.response) {
      console.error('Test failed:', error.response.data);
    } else {
      console.error('Test failed:', error.message);
    }
    process.exit(1);
  }
}

run();
