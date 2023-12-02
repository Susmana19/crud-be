//import eskternal
const { urlencoded, json } = require('express');
const express = require('express')
const app = express()
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')

//import internal
const db = require('./helper/connection')
const router = require('./src/routes/index')

//menerima x-www.form.urlencoded
app.use(urlencoded( {extended: true} ))


//static file
app.use(express.static("public"))

//menerima raw JSON
app.use(json())

// '127.0.0.1'
//cors
app.use(cors()) //semua bisa akses

//routes parent
app.use('/api/v1/', router)



//endpoint
//routing if can't get a routes
app.get('*', (req, res) => {
    return res.send({
        status: 404,
        message: "not found"
    })
})

//listening server~
app.listen(5000, (req, res) => {
    console.log('backend successfully running on port 5000');
})