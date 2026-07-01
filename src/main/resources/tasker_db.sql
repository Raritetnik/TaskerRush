CREATE DATABASE tasker_db;
use tasker_db;

CREATE TABLE users (
   id BIGSERIAL PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(20) NOT NULL
);

CREATE TABLE tasks (
   id BIGSERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   description TEXT,
   deadline DATE NOT NULL,
   status VARCHAR(20) NOT NULL,
   user_id BIGINT NOT NULL,
   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Пользователи
INSERT INTO users (username, email, password, role) VALUES
    ('john_doe', 'john@example.com', 'password123', 'USER'),
    ('admin', 'admin@example.com', 'admin123', 'ADMIN');

-- Задачи
INSERT INTO tasks (title, description, deadline, status, user_id) VALUES
  ('Complete homework', 'Finish math and science homework', '2023-12-01', 'PENDING', 1),
  ('Fix server', 'Resolve critical issue on production server', '2023-11-25', 'IN_PROGRESS', 2);