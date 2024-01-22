import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async(userId) =>{
try{
   const user = await User.findById(userId)
   const accessToken = user.generateAccessToken()
    const refreshToken =user.generateRefreshToken()
    user.refreshToken = refreshToken;
     await user.save({validateBeforeSave:false})

     return {accessToken,refreshToken}
}catch(error){
  throw new ApiError(500, "Something went wrong while generating tokens")
}
}

const registerUser = asyncHandler(async (req,res)=>{
    const {email , password,fullName,userName} = req.body;
  if([email,password,fullName,userName].some((field)=>
  field?.trim==="")){
    throw new ApiError(400, "Please fill all fields")
  }

  const existedUser = await User.findOne({
    $or:[{userName},{email}]
  })

  if(existedUser){
    throw new ApiError(409, "user already existed")
  }
  const avatarlocal =req.files?.avatar?.[0].path;
  //const coverImagelocal = req.files?.coverImage[0]?.path;
  let coverImagelocal;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImagelocal = req.files.coverImage[0].path;
  }

  if(!avatarlocal){
    throw new ApiError(400, "Please upload avatar")
  }
  //cloudinary upload baaki hai
  const avatar = await uploadOnCloudinary(avatarlocal)
  const coverImage = await uploadOnCloudinary(coverImagelocal)

  const user = await User.create({
    fullname:fullName,
    avatar: avatar.url  ,
    
    coverImage: coverImage?.url || "" ,
    email,
    password,
    username:userName.toLowerCase()
  })
 // console.log(user)
  const createdUser = await User.findOne(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }

  return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))
})

const loginUser = asyncHandler(async (req,res) => {
//email aor paasword check karna hai
//agar sahi raha to token generate karna hai
//token ko cookie me set karna hai
const {email ,username ,password} = req.body;
if(!username && !password){
  throw new ApiError(400, "Please provide username or email")

}
const user = await User.findOne({
  $or: [{username},{email}]
})
if(!user){
  throw new ApiError(404, "user does not exist")
}
const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
  throw new ApiError(401, "enter correct password")}

  await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }
  return res.status(200).cookie("accessToken" , accessToken,options).cookie("refreshToken ", refreshToken,options).json(new ApiResponse(200,{
    user:loggedInUser,
    accessToken,refreshToken
  },"User logged in successfully",
  ) )

})

const logoutUser = asyncHandler(async (req,res) => {
 await User.findByIdAndUpdate(req.user._id,{$set : {
  refreshToken:undefined
}})
const options = {
  httpOnly:true,
  secure:true
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
 const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
 if(!incomingRefreshToken){
   throw new ApiError(401, "unauthorised request")
 }
try {
  const decodedToken =jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
  
  const user = await User.findById(decodedToken._id)
  if(!user){
    throw new ApiError(401, "invalid refresh token")
  }
  if(user?.refreshToken !== incomingRefreshToken){
    throw new ApiError(401, "invalid refresh token")
  }
  const options = {
    httpOnly:true,
    secure:true
  } 
  
  const {accessToken , newrefreshToken} = await generateAccessAndRefreshToken(user._id)
  return res.status(200).cookie("accessToken" , accessToken,options).cookie("refreshToken ", newrefreshToken,options).json(new ApiResponse(200,{ accessToken,refreshToken:newrefreshToken},"Access token refreshed successfully"))
  
} catch (error) {
  throw new ApiError(401, "invalid refresh token")
}
})






export  {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken

    };