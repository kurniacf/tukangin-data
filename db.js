const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    password: "kcf170202",
    database: "apk-pkm",
    host: "localhost",
    port: 5432
});

module.exports = pool;