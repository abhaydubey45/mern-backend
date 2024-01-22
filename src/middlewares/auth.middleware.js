import { asyncHandler } from "../utils/asynchandler"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"
import jwt from "jsonwebtoken"
const JWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

if(!token){
  throw new ApiError(401, "Please login to continue")
}
const decodedToken = jwt.verify(token,process.env.ACESS_TOKEN_SECRET)

const user =await User.findById(decodedToken._id).select("-password -refreshToken")
if(!user){
  throw new ApiError(401, "invalid access token")

}
})

