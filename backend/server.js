const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const tutoringSlotRoutes = require('./routes/tutoringSlotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const studyGroupRoutes = require('./routes/studyGroupRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tutoring-slots', tutoringSlotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
