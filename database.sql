--CREATE DATABASE apk-pkm

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (50) NOT NULL,
    handphone VARCHAR(15) NOT NULL,
    avatar TEXT,
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

-- Avatar Table
CREATE TABLE avatar(
    id SERIAL NOT NULL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL
);

-- Mitra Table 
CREATE TABLE mitra(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR (255),
    image text
);

-- image mitra table
CREATE TABLE image_mitra(
    id SERIAL NOT NULL PRIMARY KEY,
    filename TEXT UNIQUE NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL
);

-- customer & avatar
CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (50) NOT NULL,
    handphone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    filename TEXT UNIQUE NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL
);

CREATE TABLE tukang(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR (50) NOT NULL,
    handphone VARCHAR(15) NOT NULL,
    ktp TEXT,
    selfi_ktp TEXT,
    password VARCHAR(255) NOT NULL
);

-- TEST
CREATE TABLE IF NOT EXISTS users_image (
    id SERIAL PRIMARY KEY NOT NULL ,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    image varchar(255) NOT NULL,
    mob_no INTEGER NOT NULL,
    user_name varchar(20) NOT NULL,
    password varchar(255) NOT NULL
);
