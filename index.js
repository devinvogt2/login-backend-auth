const express = require('express')
const app = express()
const cors = require("cors")

//middleware
app.use(express.json())//req.body
app.use(cors())

//ROUTES//

//register and login routes

app.use('/auth', require('./server/routes/jwtAuth'))

//test
app.get("/test", (req, res, next) => {
    res.json(["It works!!"]);
});

//dashboard route
app.use('/dashboard', require('./server/routes/dashboard'))

app.listen(4000, () => {
    console.log('server is up and running on port 4000!')
})



