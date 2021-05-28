const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");
const express = require('express');
const multer = require('multer');
const knex = require('knex');
const path = require("path");



router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));

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

// register
router.post('/register', validInfo, async(req, res)=>{
    // 1. destructure the req.body (name, email, handphone, password)
    try {
        const { name, email, address, handphone, password } = req.body;
        // 2. cek customer apakah ada (if user exist then throw error)
        const user = await pool.query('SELECT * FROM tukang WHERE email = $1', [email]);
        if(user.rows.length !== 0){
            return res.status(401).json("User tukang sudah ada!");
        }

        // 3. Brcypt the customer password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. enter the new customer to database
        const newCustomer = await pool.query('INSERT INTO customer (name, email, address, handphone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [name, email, address ,handphone, bcryptPassword]);
        
        // 5. generating our jwt token
        const token = jwtGenerator(newCustomer.rows[0].id);
        //res.json({token});
        res.json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login Route
router.post('/login', validInfo, async(req, res)=> {
    // 1. destructure the req.body (name, email, handphone, password)
    
    try {
        const {email, password} = req.body;
        // 2. Cek customer jika tidak ada (throw error)
        const user = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
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
        //res.json({token});
        res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/isVerify', authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


// post tukang
router.post('/', async(req, res)=>{
    try {
        const {name, email, handphone} = req.body;
        const newMitra = await pool.query(
            'INSERT INTO mitra (name, description, image) VALUES ($1, $2, $3) RETURNING *', 
            [name, description, image]
        );
        res.json(newMitra.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


// get all
router.get('/', async(req, res)=>{
    try {
        const allMitra = await pool.query('SELECT * FROM mitra');
        res.json(allMitra.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get mitra from id
router.get('/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const singleMitra = await pool.query('SELECT * FROM mitra WHERE id = ($1)', [id]);
        res.json(singleMitra.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update mitra
router.put('/:id', async(req, res)=>{
    try {
        const {id} = req.params;    //WHERE
        const {name, description, image} = req.body; //SET

        const singleMitraImage = await pool.query('SELECT filename FROM avatar WHERE id = ($1)', [id]);

        const updateMitra = await pool.query(
            'UPDATE mitra SET name = $1, description = $2, image = $3 WHERE id = $4',
            [name, description, singleMitraImage, id]
        );
        res.json({ success: true, singleMitraImage });
    } catch (err) {
        console.error(err.message);
    }
});

// delete mitra
router.delete('/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteMitra = await pool.query('DELETE FROM mitra WHERE id = $1', [id]);
        res.json("mitra delete!");
    } catch (err) {
        console.error(err.message);
    }
});

//---------------------IMAGE MITRA------------------------------
// Image upload 
const imageUploadMitra = multer({
    dest: 'images',
});

router.post('/image', imageUploadMitra.single('img'), async (req, res) =>{
    try {
        const { filename, mimetype, size } = req.file;
        const filepath = req.file.path;
        const newImageMitra = await pool.query(
            'INSERT INTO image_mitra (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING *', 
            [filename, filepath, mimetype, size]
        );
        res.json({ success: true, filename });
    } catch (err) {
        console.error(err.message);
    }
});

//IMAGE GET
router.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    db.select('*')
        .from('image_mitra')
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


module.exports = router;