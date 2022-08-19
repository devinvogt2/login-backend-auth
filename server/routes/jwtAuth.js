const router = require("express").Router()
const pool = require('../db/db')
const bcrypt = require("bcrypt")
const jwtGen = require('../utils/jwtGen')
const validInfo = require('../middleware/validInfo')
const auth = require('../middleware/auth')


//register/sign up route 
router.post("/register", validInfo, async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",
            [email]);
        if (user.rows.length !== 0) {
            return res.status(401).send("user already exists");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const hashedPasword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(`
            INSERT INTO users (user_name, user_email, user_password) 
            VALUES ($1, $2, $3)
            RETURNING *
            `
            , [name, email, hashedPasword]
        )

        const token = jwtGen(newUser.rows[0].user_id)

        console.log({ token })
        res.json({ token })

    } catch (err) {
        next(err)
        res.status(500).send("server error")
    }
})

//login route

router.post("/login", validInfo, async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await pool.query(`
         SELECT * FROM users
         WHERE user_email=$1;
        `, [email])

        // non existing user check
        if (!user) {
            res.status(401).json('User Does Not Exist Please Try Again')
        }

        //compare entered password with user_password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
        // console.log(validPassword) enable to check true/false status

        //incorrect password check
        if (!validPassword) {
            return res.status(401).json('Password is incorrect')
        }

        //grant token to user
        const token = jwtGen(user.rows[0].user_id)
        console.log({ token })
        res.json({ token })


    } catch (err) {
        next(err)
        res.status(500).send('server error')
    }
})


//verify user
router.get('/verified', auth, async (req, res) => {
    try {
        res.status(200).json({ true: "authorized" });
    } catch (err) {
        console.error(err)
        res.status(500).send('server error')
    }
})


module.exports = router