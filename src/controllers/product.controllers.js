
//import internal
const { body } = require('express-validator')
const productModel = require('../models/product.models')
const { unlink } = require('node:fs')

const productController = {
    get:(req, res)=> {
        return productModel.get(req.query)
        .then((result)=> {
            return res.status(200).send({ message: "succes", data: result })
        }).catch((error)=> {
            return res.status(500).send({ message: error })
        })
    },

    getById: (req, res)=> {
        return productModel.getById(req.params.id)
        .then((result) => {
            return res.status(200).send({ message: "succes", data: result })
        })
    },

    add: (req, res)=> {
        const request = {
            ...req.body,
            file: req.files
        }

        // if (req.body.name == undefined || req.body.price == undefined  || request.file.length == 0 || req.body.category == undefined) {
        //     return res.status(400).send({ message: "All data is Required" });
            
        // };

        return productModel.add(request)
            .then((result)=> {
                return res.status(201).send({ message: "succes", data: result })
            }).catch((error)=> {
                return res.status(500).send({ message: error })
            })
    },

    update: (req, res)=> {
        const request = {
            ...req.body,
            id: req.params.id,
            file: req.files
        }
        return productModel.update(request)
            .then((result)=> {
                if(typeof result.oldImages != "undefined"){
                for (let index = 0; index < result.oldImages.length; index++) {
                // console.log(result.oldImages[index].filename)
                unlink(`public/uploads/images/${result.oldImages[index].filename}`, (err) => {
                        // if (err) throw err;
                // console.log(`successfully deleted ${result.oldImages[index].filename}`);
                    });
                }
                //perhatikan letak return
            }
            return res.status(201).send({ message: "succes", data: result })

            }).catch((error)=> {
                return res.status(500).send({ message: error })
            })
    },
    remove: (req, res)=> {
        return productModel.remove(req.params.id)
        .then((result) => {
            for (let i = 0; i < result.length; i++) {
                unlink(`public/uploads/images/${result[i].filename}`, (err) => {
                    if (err) throw err;
                    console.log(`successfully deleted ${result[i].filename}`);
                })
            }
            return res.status(200).send({ message: "succes deleted", data: result })
        }).catch((error)=> {
            return res.status(500).send({ message: error })
        })
    }
}

module.exports = productController;


