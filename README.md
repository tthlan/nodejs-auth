- Step 1: clone repository
- Step 2: install the necessary dependencies:
  npm install express mysql2 bcryptjs jsonwebtoken dotenv sequelize validate.js supertest mocha
- Step 3: Setting Up MySQL
  CREATE DATABASE auth_db;
  
  USE auth_db;
  
  CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  Create account auth_db with password auth_db in auth_db database
  
- Final, Start the server:
  node app.js

- Run unitest
  mocha ./test/app.test