module.exports = {
    development: {
        client: "sqlite3",
        useNullAsDefault: true,
        connection: {
            filename: "db.js",
        },
        pool:{
            afterCreate: (conn, done)=>{
                conn.run("PRAGMA foreign_keys = ON", done);
            },
        },
    },
    production: {
        client: "pg", 
        connection: process.env.DATABASE_URL, 
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tablename: 'customer',
            directory: ""
        }
    }
};