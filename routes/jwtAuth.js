const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

// register
router.post("/register", validInfo, async(req, res)=>{
    // 1. destructure the req.body (name, email, handphone, password)
    
    try {
        const { name, email, handphone, password } = req.body;
        // 2. cek customer apakah ada (if user exist then throw error)
        const user = await pool.query("SELECT * FROM customer WHERE email = $1", [email]);
        if(user.rows.length !== 0){
            return res.status(401).json("User customer sudah ada!");
        }

        // 3. Brcypt the customer password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter the new customer to database
        const newCustomer = await pool.query("INSERT INTO customer (name, email, handphone, password) VALUES ($1, $2, $3, $4) RETURNING *", 
        [name, email, handphone, bcryptPassword]);
        
        // 5. generating our jwt token
        const token = jwtGenerator(newCustomer.rows[0].id);
        res.json({token});
        //res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login Route
router.post("/login", validInfo, async(req, res)=> {
    // 1. destructure the req.body (name, email, handphone, password)
    
    try {
        const {email, password} = req.body;
        // 2. Cek customer jika tidak ada (throw error)
        const user = await pool.query("SELECT * FROM customer WHERE email = $1", [email]);
        if(user.rows.length === 0){
            return res.status(401).json("Email/Password Salah");
        }

        // 3. check if incoming password == database
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword){
            return res.status(401).json("Email/Password Salah");
        }

        // 4. give jwt token
        const token = jwtGenerator(user.rows[0].id);
        res.json({token});
        //res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/isVerify", authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;