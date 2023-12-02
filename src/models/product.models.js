
const db = require("../../helper/connection")
const { v4: uuidv4 } = require('uuid')

const productModel = {
    query: (queryParams, sortType='asc', limit=3, page=1) => {
        if(queryParams.search && queryParams.cat) {
            return `WHERE name ILIKE '%${queryParams.search}%' AND category ILIKE '${queryParams.cat}%' ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${(page-1)*limit}`
        } else if(queryParams.search || queryParams.cat) {
            return `WHERE name ILIKE '%${queryParams.search}%' OR category ILIKE '${queryParams.cat}%' ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${(page-1)*limit}`
        } else if(queryParams.page >= 1){
            return `ORDER BY name ${sortType} LIMIT ${limit} OFFSET ${(page-1)*limit}`
        } else {
            return `ORDER BY name ${sortType}`
        }
    },

    get: function(queryParams) {
        const {page=1, limit=50, search='', cat='', sortType='asc'} = queryParams;

        return new Promise((resolve, reject) => {
            db.query(
                `SELECT 
                products.id, products.name, products.price, products.category,  
                json_agg(row_to_json(product_images)) images
                FROM products
                INNER JOIN product_images ON products.id=product_images.id_product
                ${search && `AND products.name ILIKE '%${search}%'`}
                ${cat && `AND products.category ILIKE '${cat}%'`}
                GROUP BY products.id ORDER BY name ${sortType} LIMIT ${limit} OFFSET (${page}-1)*${limit}`,
                (err, result) => {
                    if(err) {
                        return reject(err.message)
                    } else {
                        return resolve(result.rows)    
                    }
                }
            )
        })
    },

    getById: (id)=> {
        return new Promise((resolve, reject)=> {
            db.query(
                `SELECT * FROM products WHERE id='${id}'`,
                (err, result) => {
                    if (err) {
                    return reject(err.message)
                    } else {
                    return resolve(result.rows[0])
                    }
            });
        })
    },

    add: ({name, price, image, category, file})=> {
        return new Promise((resolve, reject)=> {
            db.query(
                `INSERT INTO products(id, name, price, image, category) VALUES('${uuidv4()}','${name}','${price}', '${image}', '${category}') RETURNING id`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        for (let i = 0; i < file.length ; i++) {
                            db.query(`INSERT INTO product_images(id_image, id_product, name, filename) VALUES ($1, $2, $3, $4)`, [uuidv4(), result.rows[0].id, name, file[i].filename])
                                        
                        }
                        return resolve({name, price, image, category, files:file})  
                    }
            });
        })
    },

    update: ({id, name, price, image, category, file})=> {
        return new Promise((resolve, reject)=> {
            db.query(`SELECT * FROM products WHERE id='${id}'`,(err, result)=>{
                if(err) {
                    return reject(err.message)
                }else {
                    db.query(
                        `UPDATE products SET name='${name || result.rows[0].name}', price='${price || result.rows[0].price}', image='${image|| result.rows[0].image}', category='${category || result.rows[0].category}' WHERE id='${id}'`,
                        (err, result) => {
                            if (err) {
                            return reject(err.message)
                            } else {
                                if(file.length <= 0) {
                                    db.query(`SELECT name, id_image, filename FROM product_images WHERE id_product='${id}'`,(errProductImages, productImages)=> {
                                    if(errProductImages) return reject({message: errProductImages.message})
                                        for (let indexNew = 0; indexNew < productImages.rows.length; indexNew++) {
                                            db.query(`UPDATE product_images SET name=$1 WHERE id_image=$2`,[name, productImages.rows[indexNew].id_image], (err, result)=> {
                                                
                                            if(err) return reject({message: "update no upload gagal"})
                                            return  resolve({id, name, price, image, category})  
                                            })                                
                                        }
                                    
                                    })
                                } 
                                
                                db.query(`SELECT name, id_image, filename FROM product_images WHERE id_product='${id}'`,(errProductImages, productImages)=> {
                                if(errProductImages) return reject({message: errProductImages.message})
                                
                                    for (let indexNew = 0; indexNew < file.length; indexNew++) {
                                        db.query(`UPDATE product_images SET name=$1, filename=$2 WHERE id_image=$3`,[name, file[indexNew].filename, productImages.rows[indexNew].id_image], (err, result)=> {
                                        if(err) return reject({message: "image gagal dihapus"})
                                        return resolve({id, name, price, category, oldImages: productImages.rows, images: file})
                                        })
                                    }
                            
                            
                                })

                            }
                        }
                    );
                }
            })
        })
    },

    remove: (id)=> {
        return new Promise((resolve, reject)=> {
            db.query(
                `DELETE from products WHERE id='${id}'`,
                (err, result) => {
                if (err) {
                    return reject(err.message);
                } else {
                    db.query(`DELETE FROM product_images WHERE id_product='${id}' RETURNING filename`, (err, result)=> {
                    if(err) return reject({message:'image can not remove'})
                    return resolve(result.rows)
                    })
                }
                });                  
        })
    } 
}

module.exports = productModel;