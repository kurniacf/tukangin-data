const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const port = process.env.PORT || 5000;

// testing
const importData = require("./testing.json");

app.use(express.json());
app.use(cors());

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
        const {name, email, address, handphone, avatar, password} = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer (name, email, address, handphone, avatar, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
            [name, email, address, handphone, avatar, password]
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
        const {name, email, address, handphone, avatar, password} = req.body; //SET

        const updateCustomer = await pool.query(
            "UPDATE customer SET name = $1, email = $2, address = $3, handphone = $4, avatar = $5, password = $6 WHERE id = $7",
            [name, email, address, handphone, avatar, password, id]
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

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

// testing
app.get("/", (req, res)=>{
    res.send("Hello World");
});

app.listen(port, ()=> {
    console.log(`Server starts on http://localhost:${5000}`);
});