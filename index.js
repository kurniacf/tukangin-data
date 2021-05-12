const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());

// routes

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
        const {name, email, address, handphone, avatar} = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer (name, email, address, handphone, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [name, email, address, handphone, avatar]
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
        const {name, email, address, handphone, avatar} = req.body; //SET

        const updateCustomer = await pool.query(
            "UPDATE customer SET name = $1, email = $2, address = $3, handphone = $4, avatar = $5 WHERE id = $6",
            [name, email, address, handphone, avatar, id]
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

app.listen(5000, ()=> {
    console.log("server running in port 5000");
});