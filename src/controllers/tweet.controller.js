import { json } from "express";
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    
    try {
        const tweet = await Tweet.create({
            content: content,
            owner: req.user?._id
        })
    
        return res
                .status(201)
                .json(new ApiResponse(201, tweet, "Tweet created successfully"))
    
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while creating the tweet", error);
    }

})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required")
    }

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    try {
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: {
                    content
                }
            },
            {new: true}
        )

        return res
                .status(200)
                .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while updated tweet")
    }

})

const getUserTweet = asyncHandler(async (req, res) => {
    // get all the tweets that belong to same user._d

    try {

        console.log(req.user._id);
        
        const userTweets = await Tweet.find({owner: req.user._id})

        return res
                .status(200)
                .json(new ApiResponse(200, userTweets, "User tweets fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching tweets")
    }
});

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    console.log("Tweet Id: ", tweetId);
    

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required")
    }

    try {
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
        console.log(deleteTweet)
        return res
                .status(200)
                .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while deleting tweet")
    }

})

export {
    createTweet,
    updateTweet,
    getUserTweet,
    deleteTweet
}