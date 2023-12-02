//import eksternal
const express = require('express')
const router = express()

//import internal
const productRoute = require('./product.routes')

// routing home
router.get('/', (req, res)=> {
    return res.send("Backend successfully running at home")
})

//routing products
router.use('/products', productRoute) 


module.exports = router;