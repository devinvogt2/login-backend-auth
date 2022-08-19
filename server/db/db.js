const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'passwrd1',
    host: 'localhost',
    port: 5432,
    database: 'jwtlogin'
})

module.exports = pool;