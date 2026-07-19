CREATE DATABASE tasker_db;
use tasker_db;

CREATE TABLE users (
   id BIGSERIAL PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(20) NOT NULL
);

CREATE TABLE projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(100) NOT NULL DEFAULT 'Project',
  description VARCHAR(500) NOT NULL DEFAULT '',
  user_id BIGINT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user
      FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
);

CREATE TABLE tasks (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   title VARCHAR(100) NOT NULL DEFAULT 'Project',
   description TEXT NOT NULL DEFAULT '',
   project_id BIGINT NOT NULL,
   status VARCHAR(20) NOT NULl DEFAULT 'PENDING',
   created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   deadline_date TIMESTAMP NULL,
   CONSTRAINT fk_task_project
       FOREIGN KEY (project_id)
           REFERENCES projects(id)
           ON DELETE CASCADE
);

-- Пользователи
INSERT INTO users (username, email, password, role) VALUES
    ('john_doe', 'john@example.com', '$2a$10$UXJPt5EpKdKqQUnVzWcdtuRpaGfhuWmaQvr0ITvN4PmsKycEX/CDy', 'USER'), --  admin123
    ('admin', 'admin@example.com', '$2a$10$UXJPt5EpKdKqQUnVzWcdtuRpaGfhuWmaQvr0ITvN4PmsKycEX/CDy', 'ADMIN'); --  admin123


                                                                                                             -- ===========================================

INSERT INTO projects (user_id, title, description)
VALUES
    (3, 'Work', 'Office tasks'),
    (3, 'Shopping', 'Things to buy'),
    (3, 'Fitness', 'Workout plan');

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Prepare report',
       'Monthly statistics',
       'DONE'
FROM projects
WHERE user_id = 3
  AND title = 'Work';

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Client meeting',
       'Discuss project scope',
       'IN_PROGRESS'
FROM projects
WHERE user_id = 3
  AND title = 'Work';

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Laptop',
       'Buy new development laptop',
       'PENDING'
FROM projects
WHERE user_id = 3
  AND title = 'Shopping';

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Protein powder',
       'Order supplements',
       'DONE'
FROM projects
WHERE user_id = 3
  AND title = 'Shopping';

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Monday workout',
       'Chest and triceps',
       'IN_PROGRESS'
FROM projects
WHERE user_id = 3
  AND title = 'Fitness';

INSERT INTO tasks (project_id, title, description, status)
SELECT id,
       'Run 5 km',
       'Morning cardio',
       'PENDING'
FROM projects
WHERE user_id = 3
  AND title = 'Fitness';