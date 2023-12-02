const { Pool } = require('pg')
require("dotenv").config();

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})



db.connect((err) => {
    if (err) {
    console.error('db connection error', err.stack)
    } else {
      console.log('database connected');
    }
})

module.exports = db;

