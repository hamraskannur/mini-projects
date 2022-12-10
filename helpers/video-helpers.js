const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('express')
const objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { AggregationCursor } = require('mongodb')
module.exports = {

    addvideo: (viedo, callback) => {
        db.get().collection('viedo').insertOne(viedo).then((data) => {
            callback(data.insertedId)
        })
    },

    getAllviedo: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deletproduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).remove({ _id: objectId(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getproductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    UpdateProduct: (productId, ProductsDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(productId) },
                {
                    $set: {
                        Name: ProductsDetails.Name,
                        Description: ProductsDetails.Description
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    addAdmin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            let state = {
                admin: null,
                userExist: false
            }
            if (!admin) {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                userData.type = 'admin'
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve(data.insertedId)
                })
            } else {
                state.userExist = true
                resolve(state)
            }
        })

    },
    getAllDetails: () => {
        return new Promise(async (resolve, reject) => {
            let Details = await db.get().collection(collection.USER_COLLECTION).aggregate([{ $match: { "type": "user" } }]).toArray()
            resolve(Details)
        })
    },
    deleteDetails: (DetailsId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(DetailsId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getuserDetails: (DetailsId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(DetailsId) }).then((response) => {
                resolve(response)
            })
        })
    },
    UpdateUserDetails: (detailsId, editDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: editDetails.Email })
            let state = {
                admin: null,
                userExist: false
            }
            if (!user) {

                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(detailsId) },
                    {
                        $set: {
                            Name: editDetails.Name,
                            Email: editDetails.Email
                        }
                    }).then((response) => {
                        resolve(state)
                    })
            } else {
                state.userExist = true
                resolve(state)
            }
        })
    },
    getAllAdminDetails: () => {
        return new Promise(async (resolve, reject) => {
            let AdminDetails = await db.get().collection(collection.USER_COLLECTION).aggregate([{ $match: { "type": "admin" } }]).toArray()
            resolve(AdminDetails)
        })
    }
}



