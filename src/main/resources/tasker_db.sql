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
);                                                                                                             -- ===========================================
