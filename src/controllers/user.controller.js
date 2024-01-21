import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
    avatar: avatarlocal.url  ,
    
    coverImage: coverImagelocal?.url || "" ,
    email,
    password,
    username:userName.toLowerCase()
  })
  const createdUser = await User.findOne(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }

  return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))
})

export  {registerUser};