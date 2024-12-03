import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")

    
    
    if (!token) {
        throw new ApiError(401, "Unauthorized")  
    }

    try {
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Unauthorized")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid access token")
    }
})