USE tutoring_system;

INSERT INTO users (username, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$qMOfiYCKzuamWhLDTe3XfeH/xonNKNmza30qbW5DtoKhv18ogV1/2', 'admin'),
('Tutor One', 'tutor1@example.com', '$2b$10$d8vP9/uicxRsaTsIbwsgYuTfja1sNJNCfuTJ2lCYaFHsKr3uiq65u', 'tutor'),
('Tutor Two', 'tutor2@example.com', '$2b$10$d8vP9/uicxRsaTsIbwsgYuTfja1sNJNCfuTJ2lCYaFHsKr3uiq65u', 'tutor'),
('Tutor Three', 'tutor3@example.com', '$2b$10$d8vP9/uicxRsaTsIbwsgYuTfja1sNJNCfuTJ2lCYaFHsKr3uiq65u', 'tutor'),
('Tutor Four', 'tutor4@example.com', '$2b$10$d8vP9/uicxRsaTsIbwsgYuTfja1sNJNCfuTJ2lCYaFHsKr3uiq65u', 'tutor'),
('Student One', 'student1@example.com', '$2b$10$JZfcv7JWb56dkjA4gVbMC.Mpgwc0lonDUipwJyo4xmjOLH6.WnE36', 'student'),
('Student Two', 'student2@example.com', '$2b$10$JZfcv7JWb56dkjA4gVbMC.Mpgwc0lonDUipwJyo4xmjOLH6.WnE36', 'student'),
('Student Three', 'student3@example.com', '$2b$10$JZfcv7JWb56dkjA4gVbMC.Mpgwc0lonDUipwJyo4xmjOLH6.WnE36', 'student'),
('Student Four', 'student4@example.com', '$2b$10$JZfcv7JWb56dkjA4gVbMC.Mpgwc0lonDUipwJyo4xmjOLH6.WnE36', 'student'),
('Student Five', 'student5@example.com', '$2b$10$JZfcv7JWb56dkjA4gVbMC.Mpgwc0lonDUipwJyo4xmjOLH6.WnE36', 'student');

INSERT INTO subjects (name, description) VALUES
('Mathematics', 'Algebra, calculus, and exam preparation'),
('Physics', 'Mechanics, electricity, and physics tutoring'),
('Chemistry', 'Organic, inorganic, and lab review'),
('English', 'Essay writing, reading comprehension, and grammar'),
('Computer Science', 'Programming, algorithms, and data structures'),
('Biology', 'Life science and biology tutoring'),
('Economics', 'Microeconomics, macroeconomics, and finance'),
('History', 'World history, modern history, and research skills');

INSERT INTO tutor_profiles (user_id, bio, expertise, hourly_rate) VALUES
(2, 'Experienced math and physics tutor helping high-school learners.', 'Mathematics, Physics', 45.00),
(3, 'Chemistry specialist supporting students with lab and lecture work.', 'Chemistry, Biology', 40.00),
(4, 'Computer science tutor focused on coding interviews and projects.', 'Programming, Algorithms', 50.00),
(5, 'English tutor for writing, reading, and test prep.', 'English, Literature', 35.00);

INSERT INTO tutoring_slots (tutor_id, subject_id, date, start_time, end_time, status) VALUES
(2, 1, '2026-06-10', '09:00', '10:00', 'open'),
(2, 2, '2026-06-11', '11:00', '12:00', 'open'),
(3, 3, '2026-06-12', '14:00', '15:00', 'open'),
(3, 6, '2026-06-13', '10:00', '11:00', 'open'),
(4, 5, '2026-06-14', '16:00', '17:00', 'open'),
(4, 1, '2026-06-15', '12:00', '13:00', 'open'),
(5, 4, '2026-06-16', '15:00', '16:00', 'open'),
(5, 8, '2026-06-17', '13:00', '14:00', 'open'),
(2, 1, '2026-06-18', '09:30', '10:30', 'open'),
(3, 5, '2026-06-19', '14:30', '15:30', 'open'),
(4, 7, '2026-06-20', '10:00', '11:00', 'open'),
(5, 6, '2026-06-21', '11:00', '12:00', 'open'),
(2, 2, '2026-06-22', '12:00', '13:00', 'open'),
(3, 3, '2026-06-23', '15:00', '16:00', 'open'),
(4, 5, '2026-06-24', '17:00', '18:00', 'open');

INSERT INTO bookings (student_id, slot_id, status, request_message) VALUES
(6, 1, 'approved', 'Looking to review algebra and exam questions.'),
(7, 2, 'requested', 'Need help with electricity and circuits.'),
(8, 3, 'approved', 'Organic chemistry lab review requested.'),
(9, 4, 'requested', 'Biology study support for upcoming exam.'),
(10, 5, 'requested', 'Computer science project debugging help.'),
(6, 6, 'requested', 'Calculus question walkthrough.'),
(7, 7, 'requested', 'Writing practice and grammar help.'),
(8, 8, 'requested', 'History essay preparation session.'),
(9, 9, 'requested', 'Math revision for finals.'),
(10, 10, 'requested', 'Programming challenge walkthrough.');

UPDATE tutoring_slots SET status = 'booked' WHERE id IN (1,2,3,4,5,6,7,8,9,10);

INSERT INTO study_groups (title, subject_id, created_by, description, meeting_date, location_or_link) VALUES
('Calculus Review Group', 1, 6, 'Weekly calculus study sessions for exam prep.', '2026-06-11', 'Zoom: https://example.com/calc'),
('Chemistry Lab Prep', 3, 7, 'Collaborative lab report review and problem solving.', '2026-06-12', 'Room 204, Science Building'),
('English Essay Workshop', 4, 8, 'Peer review sessions for essays and reading notes.', '2026-06-15', 'Teams: https://example.com/english'),
('Programming Practice Session', 5, 9, 'Group coding exercises and algorithm discussions.', '2026-06-16', 'Discord: https://discord.gg/coding'),
('History Research Circle', 8, 10, 'Study circle for history assignments and exam prep.', '2026-06-18', 'Library Study Room 2');

INSERT INTO group_members (group_id, student_id) VALUES
(1, 6),
(1, 7),
(2, 7),
(2, 8),
(3, 8),
(3, 9),
(4, 9),
(4, 10),
(5, 10),
(5, 6);
