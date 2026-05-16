process.env.NODE_ENV ??= "test";
process.env.PORT ??= "3001";
process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/appointments_test?schema=public";
process.env.JWT_ACCESS_SECRET ??= "test_access_secret_1234567890";
process.env.CORS_ORIGIN ??= "*";
