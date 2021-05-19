const express = require("express");
const app = express();
const pool = require("./db");
//const {pool} = require('./config')
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

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
        
    }
});

// create
app.post("/customer", async (req, res)=>{
    try {
        const {name, email, jalan, nomor_rumah, handphone, avatar, password} = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer (name, email, jalan, nomor_rumah, handphone, avatar, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
            [name, email, jalan, nomor_rumah, handphone, avatar, password]
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
        
    }
});

// get single customer_id
app.get("/alamat/customer/:customer_id", async(req, res)=>{
    const {customer_id} = req.body;
    try {
        const alamatCustomer = await pool.query("SELECT * FROM alamat WHERE customer_id = ($1)", [customer_id]);
        res.json(alamatCustomer.rows);
    } catch (err) {
        
    }
});

// create
app.post("/alamat", async (req, res)=>{
    try {
        const {customer_id, provinsi, kabupaten, kelurahan, jalan, nomor_rumah} = req.body;
        const newAlamat = await pool.query(
            "INSERT INTO alamat (customer_id, provinsi, kabupaten, kelurahan, jalan, nomor_rumah) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
            [customer_id, provinsi, kabupaten, kelurahan, jalan, nomor_rumah]
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
        const {customer_id, provinsi, kabupaten, kelurahan, jalan, nomor_rumah} = req.body; //SET
        
        const updateAlamat = await pool.query(
            "UPDATE alamat SET customer_id = $1, provinsi = $2, kabupaten = $3, kelurahan = $4, jalan = $5, nomor_rumah = $6 WHERE id = $7",
            [customer_id, provinsi, kabupaten, kelurahan, jalan, nomor_rumah, id]
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