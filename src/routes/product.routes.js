//import eksternal
const express = require('express')
const router = express()

//import controller and validation internal
const productController = require('../controllers/product.controllers')
const verifyToken = require('../../helper/verifyToken')
// const validationProduct = require('../middlewares/validation')
const formUpload = require('../../helper/formUpload')

//route products
router.get('/', productController.get)
router.get('/:id', productController.getById)
router.post('/', formUpload.array('image'), productController.add)
router.patch('/:id', formUpload.array('image'), productController.update)
router.delete('/:id', productController.remove)

//export
module.exports = router;

