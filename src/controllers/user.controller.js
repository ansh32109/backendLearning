import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js'
import { User } from '../models/user.models.js'
import { uploadToCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler( async (req, res) => {
    // get user details

    const { fullName, username, email, password } = req.body;
    console.log('email: ' + email);
    
    // validation to check if empty

    // one way to tackle validation: writing all fields one by one
    // if(fullName==="") throw new ApiError(400, "Full name is required")
    
    // alternate way: involving checking all in one go
    if(
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are mandatory")
    }

    // check if user is unique or not

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existingUser) throw new ApiError(409, "User with same email or password already exists")
    
    // check if avatar, cover image is given or not

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar Image required")
    }

    // upload to cloudinary

    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImg = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400, "Avatar is required")

    // create user object to put into mongo

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImg?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refreshToken from response returned from mongo

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // check if user is successfully created

    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user")

    // return final response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

} )

export { registerUser }