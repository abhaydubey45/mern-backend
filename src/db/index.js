import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

const db = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongodb connected at ${connectionInstance.connection.host}`);



    }catch(error){
        console.log("mongodb connection error:" , error)
    }
}

export default db;