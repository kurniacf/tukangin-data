const pool = require("../db");
const multer = require('multer');
const knex = require('knex');
const path = require("path");
const router = require("express").Router();

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

// post mitra
router.post("/", async(req, res)=>{
    try {
        const {name, description, image} = req.body;
        const newMitra = await pool.query(
            "INSERT INTO mitra (name, description, image) VALUES ($1, $2, $3) RETURNING *", 
            [name, description, image]
        );
        res.json(newMitra.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get all
router.get("/", async(req, res)=>{
    try {
        const allMitra = await pool.query("SELECT * FROM mitra");
        res.json(allMitra.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get mitra from id
router.get("/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        const singleMitra = await pool.query("SELECT * FROM mitra WHERE id = ($1)", [id]);
        res.json(singleMitra.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update mitra
router.put("/:id", async(req, res)=>{
    try {
        const {id} = req.params;    //WHERE
        const {name, description, image} = req.body; //SET

        const updateMitra = await pool.query(
            "UPDATE mitra SET name = $1, description = $2, image = $3 WHERE id = $4",
            [name, description, image, id]
        );
        res.json("mitra was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// delete mitra
router.delete("/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteMitra = await pool.query("DELETE FROM mitra WHERE id = $1", [id]);
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
            "INSERT INTO image_mitra (filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING *", 
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