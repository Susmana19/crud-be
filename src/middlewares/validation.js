const {check, validationResult} = require('express-validator')

//trim() dan escape() utk menghindari Cross Site Scripting (serangan XSS)
const rules = [
    check('name')
        .notEmpty().withMessage('The name of product is can not be empty')
        .trim()
        .escape(),

    check('price')
        .notEmpty().withMessage('The price of product is can not be empty')
        .isNumeric().withMessage('The price of product is must a numeric type')
        .trim()
        .escape(),

    check('image')
        .notEmpty().withMessage('The image of product is can not be empty')
        .trim()
        .escape(),

    check('category')
        .notEmpty().withMessage('The category of product is can not be empty')
        .trim()
        .escape(),   
]

const validationProduct = [
    //Rules
    rules,

    //Response
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()[0].msg})
        }
        next();
    }
]
//status 422 jarang digunakan. hanya usecase tertentu
//lebih baik status 400 : bad request

module.exports = validationProduct;