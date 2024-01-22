import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const JWTVerify = asyncHandler(async(req,res,next)=>{
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
  
  if(!token){
    throw new ApiError(401, "Please login to continue")
  }
  const decodedToken = jwt.verify(token,process.env.ACESS_TOKEN_SECRET)
  
  const user =await User.findById(decodedToken._id).select("-password -refreshToken")
  if(!user){
    throw new ApiError(401, "invalid access token")
  }
  req.user = user; //naya object req ke andar
  next();
    } catch (error) {
      throw new ApiError(401, error?.msg || "invalid access token")
    }
})  

