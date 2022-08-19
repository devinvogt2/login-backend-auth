const router = require('express').Router()
const pool = require('../db/db')
const auth = require('../middleware/auth')


router.get('/', auth, async (req, res, next) => {
    try {
        // res.json(req.user)

        const user = await pool.query(`
            SELECT user_name, user_email FROM users 
            WHERE user_id=$1;
        `, [req.user])

        res.json(user.rows[0])
    } catch (err) {
        next(err)
        res.status(500).json("server error")
    }
})

module.exports = router