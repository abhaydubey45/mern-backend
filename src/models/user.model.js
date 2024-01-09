import mongoose  from "mongoose"

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        lowercase: true,
        trim: true,
        index: true,
        unique : true
    },
    email:{
        type: String,
        required:true,
        lowercase: true,
        trim: true,
        unique : true
    },
    fullname:{
        type: String,
        required:true,
        trim: true
        
    },
    username:{
        type: String,
        required:true,
        lowercase: true,
        trim: true,
        index: true,
        unique : true
    },
})

export const User = mongoose.model("User" , UserSchema)