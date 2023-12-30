//require('dotenv').config({path: './env'})

import dotenv from 'dotenv'

import db from './db/index.js'
import { app } from './app.js'
dotenv.config({path: './env'})
 

db().then(() => {
    app.listen(process.env.PORT|| 8000, () => {
        console.log(`port is connected at ${process.env.PORT}` );
    })
    
}).catch((err) => {
                console.log( "mongodb connection failed",err)
            })


 
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
