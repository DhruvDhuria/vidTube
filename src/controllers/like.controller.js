import { configDotenv } from "dotenv";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  // find if there is a like for this video by checking the videoId and likedBy in the video like colletion

  const like = await Like.find({video: videoId, likedBy: req.user._id})
  
  // if there is a like, delete it
  if (like.length > 0) {
    console.log(like)
    try {
        const removedLike = await Like.findByIdAndDelete(like[0]._id)
        
        return res
                .status(200)
                .json(new ApiResponse(200, removedLike, "Liked removed successfully"))
    } catch (error) {
        console.log("ERROR", error)
        throw new ApiError(500, "Something went wrong while removing like")
    }
  } else {
    try {
        const addLike = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
    
        return res
                .status(200)
                .json(new ApiResponse(200, addLike, "Like added successfully"))

    } catch (error) {
        console.log("Error", error)  
        throw new ApiError(500, "Something went wrong while adding like")
    }
  }

  // if there is no like, create one
  // return the updated video

});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required")
  }

  const commentLike = await Like.find({comment: commentId, likedBy: req.user._id})

  if (commentLike.length > 0) {
    try {
        const removeLike = await Like.findByIdAndDelete(commentLike[0]._id)

        return res 
                .status(200)
                .json(new ApiResponse(200, removeLike, "Comment like removed successfully"))
    } catch (error) {
        console.log("ERROR", error)
        throw new ApiError(500, "Something went wrong while removing comment like")
    }
  } else {
    try {
        const addLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res
                .status(200)
                .json(new ApiResponse(200, addLike, "Comment like added successfully"))
    } catch (error) {
        console.log("ERROR", error)
        throw new ApiError(500, "Something went wrong while adding comment like")
    }
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required")
    }

    let likedTweet = await Like.find({tweet: tweetId, likedBy: req.user._id})

    if (likedTweet.length > 0) {
        try {
            const romoveTweetLike = await Like.findByIdAndDelete(likedTweet[0]._id)
            
            

            return res 
                    .status(200)
                    .json(new ApiResponse(200, romoveTweetLike, "Tweet like removed successfully"))
        } catch (error) {
            console.log("ERROR", error)
            throw new ApiError(500, "Something went wrong while removing tweet like")
        }
    } else {
        try {
            const addTweetLike = await Like.create({
                tweet: tweetId,
                likedBy: req.user._id
            })

            return res
                    .status(200)
                    .json(new ApiResponse(200, addTweetLike, "Tweet like added successfully"))
        } catch (error) {
            console.log("ERROR", error)
            throw new ApiError(500, "Something went wrong while adding tweet like")
        }
    }

});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  // match all videos whos likedBy field is same
  try {
    const likedVideos = await Like.aggregate([
      {
          $match: {
              likedBy: req.user._id,
              video: {$exists: true}
          }
      } 
    ])
  
    return res
            .status(200)  
            .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
  } catch (error) {
    console.log("Error", error)
    throw new ApiError(500, "Something went wrong while fetching liked videos")
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
