import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req,res)=>{
    const {email , password,fullName,userName} = req.body;
  if([email,password,fullName,userName].some((field)=>
  field?.trim==="")){
    throw new ApiError(400, "Please fill all fields")
  }

  const existedUser =User.findOne({
    $or:[{userName},{email}]
  })

  if(existedUser){
    throw new ApiError(409, "user already existed")
  }
  const avatarlocal =req.files?.avatar?.[0].path;
  const coverImagelocal = req.files?.coverImage[0]?.path;

  if(!avatarlocal){
    throw new ApiError(400, "Please upload avatar")
  }
  //cloudinary upload baaki hai

  const user = await User.create({
    fullName,
    //avatar: //avatarlocal.url  "cloudinary url"
    coverImage:coverImagelocal,
    //coverImage: //coverImagelocal?.url  "cloudinary url"
    email,
    password,
    userName:userName.toLowerCase()
  })
  const createdUser = await User.findOne(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }

  return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))
})

export  {registerUser};