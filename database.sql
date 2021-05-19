--CREATE DATABASE apk-pkm

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (50) NOT NULL,
    handphone VARCHAR(15) NOT NULL,
    avatar BYTEA,
    password VARCHAR(255) NOT NULL
);

-- fake users
-- INSERT INTO customer (name, email, address, handphone, avatar, password) 
-- VALUES ('Aurora', 'aurora@gmail.com', 'surabaya' ,'085741234', null, 'ikigayo123');

-- AKSES POSTMAN SERVER
-- http://localhost:5000/auth/register
-- http://localhost:5000/auth/login
-- http://localhost:5000/customer

CREATE TABLE alamat(
    id SERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customer (id) NOT NULL,
    provinsi VARCHAR(255),
    kabupaten VARCHAR(255),
    kecamatan VARCHAR(255),
    kelurahan VARCHAR(255),
    jalan VARCHAR(255),
    nomor_rumah VARCHAR(50),
    kode_pos VARCHAR(25)
);