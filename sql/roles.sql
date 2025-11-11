CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  role VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO roles (role)
VALUES 
  ('admin'),
  ('buyer'),
  ('seller');
select * from roles;
