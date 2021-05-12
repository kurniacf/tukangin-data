CREATE DATABASE apk-pkm

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR (255),
    address VARCHAR(255),
    handphone VARCHAR(50),
    avatar BYTEA
);