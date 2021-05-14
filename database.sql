CREATE DATABASE apk-pkm

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR (255),
    address VARCHAR(255),
    handphone VARCHAR(50),
    avatar BYTEA
);

-- fake users
INSERT INTO customer (name, email, address, handphone, avatar, password) 
VALUES ('Aurora', 'aurora@gmail.com', 'surabaya' ,'085741234', null, 'ikigayo123');

-- AKSES POSTMAN SERVER
-- http://localhost:5000/auth/register
-- http://localhost:5000/auth/login
-- http://localhost:5000/customer