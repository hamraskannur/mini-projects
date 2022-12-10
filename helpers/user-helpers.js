const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

module.exports = {
    doSinup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            let response = {
                user: null,
                userExist: false }
                
            if (!user) {

                userData.Password = await bcrypt.hash(userData.Password, 10)
                userData.type = 'user'
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    response.userExist=false
                    response.user=userData
                    console.log(data);
                    resolve(data.insertedId)
                })
            }else{
                response.userExist=true
                resolve(response)
            }
        })

    },
    dologin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let Status = false
            let response = {}

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })

            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })

            } else {
                resolve({ status: false })

            }
        })
    }
}