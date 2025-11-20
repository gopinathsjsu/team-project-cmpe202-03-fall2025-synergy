-- Initialize database schema and sample data for Campus Marketplace

-- Create users table if it doesn't exist (JPA will handle this, but we ensure the status column exists)
-- Note: JPA will auto-create the table, but we can add sample data here

-- Insert sample users with status values
INSERT INTO users (username, email, password, first_name, last_name, status) 
VALUES 
    ('alice', 'alice@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice', 'Johnson', 'ACTIVE'),
    ('bob', 'bob@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob', 'Smith', 'SUSPENDED'),
    ('carol', 'carol@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carol', 'Williams', 'ACTIVE'),
    ('david', 'david@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David', 'Brown', 'ACTIVE'),
    ('eve', 'eve@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Eve', 'Davis', 'SUSPENDED')
ON CONFLICT (username) DO NOTHING;

-- Note: The password hash above is a placeholder. In production, use proper password hashing.
-- The status column accepts only 'ACTIVE' or 'SUSPENDED' values as defined by the UserStatus enum.

