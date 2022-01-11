const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const CONNECT = process.env.MONGO_DB_URI

let connection = null;

(async ()=>{
    try {
        console.log(`Conexion de mongo Atlas creada en ${CONNECT}`)
        connection = await mongoose.connect(`${CONNECT}`)
    } catch (error) {
        console.log('error al conectarse a Mongo Atlas')
        
    }
})()

const usersSchema = new Schema({

    name: {
            type: String,
            required:true
    },  
    email: {
            type: String,
            required: true,
            unique: true
    },
    password: {
            type:String,
            required: true
    },
    date: {
            type:Date,
            default: moment().format('LLL')
}
      
})
const usersModel = mongoose.model(process.env.D_NAME_USERS, usersSchema)
module.exports =  usersModel 