//require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
import express from 'express'
import db from './db/index.js'
dotenv.config({path: './env'})
 const app = express()

db()


 
//ifi type of function

//  ;( async() => {
//     try{
//        await mongoose.connect(process.env.MONGODB_URI/DB_NAME)
//        app.on("error" , (error) => {
//         console.log("ERR :" , error)
//         throw error;
//        })

//        app.listen(process.env.PORT , () => {
//         console.log("port is connected")
//        })
//     }catch (error){
//         console.log(error)
//     }
// })()
