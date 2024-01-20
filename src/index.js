// Import necessary modules
import dotenv from 'dotenv';
import db from './db/index.js';
import { app } from './app.js';


dotenv.config({ path: './env' });


db()
  .then(() => {
    
    const port = 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });



 
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
