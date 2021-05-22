const express = require("express");
const app = express();
const pool = require("./db");
//const {pool} = require('./config')
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
const multer = require('multer');
const knex = require('knex');

// Routes for Image 
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port:  process.env.PG_PORT
    },
});

// process.env.PORT
//process.env.NODE_ENV => production or undefined

// testing
const importData = require("./testing.json");

app.use(express.json());
app.use(cors());

//app.use(express.static(path.join(__dirname, "client/public")));
app.use(express.static("./client/build"));

if (process.env.NODE_ENV === "production") {
    //server static content
    //npm run build
    app.use(express.static(path.join(__dirname, "client/build")));
}
console.log(__dirname);
console.log(path.join(__dirname, "client/build"));

// testing
app.get("/testing", (req, res)=>{
    res.send(importData);
});


// routes

// Register and Login Routes
app.use("/auth", require("./routes/jwtAuth"));

// get all
app.get("/customer", async(req, res)=>{
    try {
        const allCustomer = await pool.query("SELECT * FROM customer");
        res.json(allCustomer.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get single
app.get("/customer/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        const singleCustomer = await pool.query("SELECT * FROM customer WHERE id = ($1)", [id]);
        res.json(singleCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// create
app.post("/customer", async (req, res)=>{
    try {
        const {name, email, handphone, avatar, password} = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer (name, email, handphone, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [name, email, handphone, avatar, password]
        );
        res.json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update
app.put("/customer/:id", async(req, res)=>{
    try {
        const {id} = req.params;    //WHERE
        const {name, email, handphone, avatar, password} = req.body; //SET

        const updateCustomer = await pool.query(
            "UPDATE customer SET name = $1, email = $2, handphone = $3, avatar = $4, password = $5 WHERE id = $6",
            [name, email, handphone, avatar, password, id]
        );
        res.json("customer was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// delete
app.delete("/customer/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteCustomer = await pool.query("DELETE FROM customer WHERE id = $1", [id]);
        res.json("customer delete!");
    } catch (err) {
        console.error(err.message);
    }
});
// ----------------------------------------------------------------------------
// ALAMAT CRUD
app.get("/alamat", async(req, res)=>{
    try {
        const allAlamat = await pool.query("SELECT * FROM alamat");
        res.json(allAlamat.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get single
app.get("/alamat/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        const singleAlamat = await pool.query("SELECT * FROM alamat WHERE id = ($1)", [id]);
        res.json(singleAlamat.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get single customer_id
app.get("/alamat/idcus/:customer_id", async(req, res)=>{
    const {customer_id} = req.params;
    try {
        const singleAlamat = await pool.query("SELECT * FROM alamat WHERE customer_id = ($1)", [customer_id]);
        res.json(singleAlamat.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// create
app.post("/alamat", async (req, res)=>{
    try {
        const {customer_id, provinsi, kabupaten, kecamatan, kelurahan, jalan, nomor_rumah, kode_pos} = req.body;
        const newAlamat = await pool.query(
            "INSERT INTO alamat (customer_id, provinsi, kabupaten, kecamatan, kelurahan, jalan, nomor_rumah, kode_pos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [customer_id, provinsi, kabupaten, kecamatan, kelurahan, jalan, nomor_rumah, kode_pos]
        );
        res.json(newAlamat.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update
app.put("/alamat/:id", async(req, res)=>{
    try {
        const {id} = req.params;    //WHERE
        const {customer_id, provinsi, kabupaten, kecamatan, kelurahan, jalan, nomor_rumah, kode_pos} = req.body; //SET
        
        const updateAlamat = await pool.query(
            "UPDATE alamat SET customer_id=$1, provinsi=$2, kabupaten=$3, kecamatan=$4, kelurahan=$5, jalan=$6, nomor_rumah=$7, kode_pos=$8 WHERE id = $9",
            [customer_id, provinsi, kabupaten, kecamatan, kelurahan, jalan, nomor_rumah, kode_pos]
        );
        res.json("alamat was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// delete
app.delete("/alamat/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteAlamat = await pool.query("DELETE FROM alamat WHERE id = $1", [id]);
        res.json("alamat delete!");
    } catch (err) {
        console.error(err.message);
    }
});

// IMAGE ---------------------------
// Image upload 
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port:  process.env.PG_PORT
    },
});



const imageUpload = multer({
    dest: 'images',
});

// image POST
app.post('/customer/avatar', imageUpload.single('avatar'), async (req, res) =>{
    try {
        const { filename, mimetype, size } = req.file;
        const filepath = req.file.path;
        const newAvatar = await pool.query(
            "INSERT INTO avatar (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING *", 
            [filename, filepath, mimetype, size]
        );
        res.json({ success: true, filename });
    } catch (err) {
        console.error(err.message);
    }
});


// IMAGE GET
app.get('/customer/avatar/:filename', (req, res) => {
    const { filename } = req.params;
    db.select('*')
        .from('avatar')
        .where({ filename })
        .then(images => {
            if (images[0]) {
                const dirname = path.resolve();
                const fullfilepath = path.join(dirname, images[0].filepath);
                return res.type(images[0].mimetype).sendFile(fullfilepath);
            }
            return Promise.reject(new Error('Image does not exist'));
        })
        .catch(err =>
        res
            .status(404)
            .json({ success: false, message: 'not found', stack: err.stack }),
        );
});


// ------------- image


// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

// testing
app.get("/", (req, res)=>{
    res.send("Hello World");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, ()=> {
    console.log(`Server starts on http://localhost:${5000}`);
});