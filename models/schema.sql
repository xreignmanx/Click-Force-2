DROP DATABASE IF EXISTS clickForce_db;
CREATE DATABASE clickForce_db;

USE clickForce_db;

CREATE TABLE registration (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NULL,
  password VARCHAR(100) NULL,
  verified BOOLEAN DEFAULT false,
  high_score INT, NOT NULL,
  PRIMARY KEY (id)
);
