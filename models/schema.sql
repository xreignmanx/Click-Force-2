DROP DATABASE IF EXISTS clickForce_db;
CREATE DATABASE clickForce_db;

USE clickForce_db;

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  authenticated BOOLEAN DEFAULT false,
  secretToken VARCHAR(255) UNIQUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id)
);

UPDATE Users
SET authenticated = TRUE 
WHERE email = 'o6943414@nwytg.net';

