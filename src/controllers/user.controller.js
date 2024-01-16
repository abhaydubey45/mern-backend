import {asynchandler} from '../utils/asynchandler.js'

const registerUser = asynchandler(async (req,res)=>{
    res.send("Register User")
})

export  {registerUser};