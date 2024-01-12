import mongoose  from "mongoose"
import bcrypt from "bcrypt"

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

UserSchema.pre("save" , async function (next){
    if(!this.isModified) return next()
   this.password =  bcrypt.hash(this.password , 10)
   next()
})

UserSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password , this.password)
}

UserSchema.methods.generateAccessToken = function (){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET , {expiresIn:process.env.ACCESS_TOKEN_EXPIRY} )
}
UserSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET , {expiresIn:process.env.REFRESH_TOKEN_EXPIRY} )
}




export const User = mongoose.model("User" , UserSchema)