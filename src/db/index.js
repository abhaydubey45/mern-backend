import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
const db = async() => {
try{
const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
console.log(`monngodb connected at ${connectionInstance.connection.host}`)
}catch(error){
console.log('mongodb connection error failed',error);
process.exit(1);
}
}

export default db;