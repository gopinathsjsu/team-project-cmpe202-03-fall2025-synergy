CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  phone      VARCHAR(20),

  created_audit_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_audit_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  update_audit_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  update_audit_time TIMESTAMPTZ,

  delete_audit_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  delete_audit_time TIMESTAMPTZ
);
insert into users(first_name, last_name, email, phone, created_audit_id) values('Yaswant','Dokala','yaswanthdokala@gmail.com','4085813042',1)
