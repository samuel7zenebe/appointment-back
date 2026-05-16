# Online Appointment Booking API (TypeScript + Express + Prisma + Postgres)

## Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Start infra: `docker-compose up -d db`
3. Generate client + migrate + seed:
   - `npm run db:generate`
   - `npm run db:migrate`
   - `npm run db:seed`
4. Run API: `npm run dev`

Docs: `http://localhost:3000/docs`  
Health: `http://localhost:3000/health`

## API (base path: `/api`)
- Auth: `POST /auth/register | /auth/login`
- Users: `GET /users/me`, `PATCH /users/me`
- Specialties: `GET /specialties`
- Doctors: `GET /doctors`, `GET /doctors/:id`, `POST /doctors/availability`, `GET /doctors/appointments`, `PATCH /doctors/profile`
- Doctor availability: `GET /doctors/:id/availability`
- Appointments: `POST /appointments`, `GET /appointments/my`, `PATCH /appointments/:id/cancel`, `PATCH /appointments/:id/status`
- Admin: `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `POST /admin/specialties`, `GET /admin/analytics`
