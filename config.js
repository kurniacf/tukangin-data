require('dotenv').config()

DB_USER: "postgres"
DB_PASSWORD: "kcf170202"
DB_DATABASE: "apk-pkm"
DB_HOST: "localhost"
DB_PORT: 5432

const {Pool} = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
})

module.exports = {pool}