# Online Tutoring and Study Group System

## Overview

A full-stack web application built with React + Tailwind CSS on the frontend, Node.js + Express on the backend, and MySQL for the database.

## Folder structure

- `/backend` — Express API server, auth, role-based access, validation, MySQL connection
- `/frontend` — Vite + React app, routing, auth context, dashboards
- `/database` — `schema.sql` and `seed.sql` for MySQL creation and sample data

## Test accounts

- Admin: `admin@example.com` / `Admin123!`
- Tutor: `tutor1@example.com` / `Tutor123!`
- Student: `student1@example.com` / `Student123!`

## Features

- User registration and login with JWT
- Role-based access control for student, tutor, admin
- CRUD subjects for admin
- Tutor slot creation and management
- Booking requests for students
- Tutor approval and rejection of bookings
- Study group creation, join, and leave
- MySQL schema with foreign keys, indexes, and seeded sample data
- Frontend auth state, sidebar navigation, responsive UI
- Backend validation, error handling, and rate limiting on login
