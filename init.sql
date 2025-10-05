-- SQLite initialization for LIMKO Reports (simple schema)

BEGIN TRANSACTION;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL -- student, lecturer, prl, pl, admin
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL
);

CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  faculty_name TEXT,
  class_name TEXT,
  week_of_reporting TEXT,
  date_of_lecture TEXT,
  course_id INTEGER,
  lecturer_id INTEGER,
  actual_present INTEGER,
  total_registered INTEGER,
  venue TEXT,
  scheduled_time TEXT,
  topic TEXT,
  learning_outcomes TEXT,
  recommendations TEXT,
  FOREIGN KEY(course_id) REFERENCES courses(id),
  FOREIGN KEY(lecturer_id) REFERENCES users(id)
);

-- Seed minimal data
INSERT INTO users (name,email,role) VALUES ('Alice Lecturer','alice@limkokwing.ac.ls','lecturer');
INSERT INTO users (name,email,role) VALUES ('Bob Student','bob@student.limkokwing.ac.ls','student');
INSERT INTO users (name,email,role) VALUES ('Carol PRL','carol@limkokwing.ac.ls','prl');
INSERT INTO users (name,email,role) VALUES ('David PL','david@limkokwing.ac.ls','pl');

INSERT INTO courses (name,code) VALUES ('Introduction to IT','IT101');
INSERT INTO courses (name,code) VALUES ('Business Systems','BS201');

COMMIT;
