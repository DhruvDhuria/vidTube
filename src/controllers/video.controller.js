import mongoose from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query;
    
    const pageNumber = parseInt(page)
    const pageSize = parseInt(limit)


    const filter = {}
    if(query) {
        filter.title = {$regex: query, $options: "i"};
    }

    if (userId) {
        filter.userId = userId
    }

    const sortCriteria = {}
    if (sortBy) {
        sortCriteria[sortBy] = sortType === "asc" ? 1 : -1
    }

    try {
      // Fetch videos from the database
      const videos = await Video.find(filter)
        .sort(sortCriteria)
        .skip((pageNumber - 1) * pageSize) 
        .limit(pageSize); 

      // Get total count for pagination meta-data
      const totalVideos = await Video.countDocuments(filter);

      // Return the results
      res.status(200).json({
        success: true,
        data: videos,
        pagination: {
          total: totalVideos,
          page: pageNumber,
          limit: pageSize,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }


})

const publishAVideo = asyncHandler( async (req, res) => {
    const  {title, description} = req.body;

    if (!(title || description)) {
        throw new ApiError(400, "Title and Description is required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnaiiLocalPath = req.files?.thumbnail[0]?.path
    
    

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missing")
    }

    if (!thumbnaiiLocalPath) {
        throw new ApiError(400, "Thumbnail is missing")
    }

    let videoFile;
    try {
        videoFile = await uploadOnCloudinary(videoLocalPath)
        console.log("Video uploaded on cloudinary")
    } catch (error) {
        console.log("Error uploading video on cloudinary", error)
        throw new ApiError(500, "Failed to upload video")
    }

    let thumbnail;
    try {
        thumbnail = await uploadOnCloudinary(thumbnaiiLocalPath)
        console.log("Thumbnail uploaded on cloudinary")
    } catch (error) {
        console.log("Error uploading thumbnail on cloudinary", error)
        throw new ApiError(500, "Failed to upload thumbnail")
    }

    try {
        
        const video = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            duration: videoFile.duration,
            owner: req.user._id
        })
        

        const publishedVideo = await Video.findById(video._id)

        if (!publishedVideo){
            throw new ApiError(500, "Something went wrong while Publishing the video")
        }

        return res
                .status(201)
                .json(201, publishedVideo, "Video published successfully")
    } catch (error) {

        if(videoFile) {
            await deleteFromCloudinary(videoFile.public_id)
        }
        if(thumbnail) {
            await deleteFromCloudinary(thumbnail.public_id)
        }

        throw new ApiError(500, "Error occured while publishing the video")
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!videoId) {
        throw new ApiError(400, "Video Id is required")
    }
    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {title, description} = req.body
    const thumbnailLocalPath = req.file?.path;

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    let video;

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!thumbnail.url) {
            throw new ApiError(500, "Something went wrong while uploading thumbnail")
        }

        video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    thumbnail: thumbnail.url
                }
            },
            {new: true}
        )
    }

    if (title || description) {
        video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description
                }
            },
            {new: true}
        )
    }

    return res
            .status(200)
            .json(new ApiResponse(200, video, "Video updated Successfully"))
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!videoId) {
        throw new ApiError(400, "Video Id is required")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)    

    return res
            .status(200)
            .json(new ApiResponse(200, deletedVideo, "Video successfully deleted"))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!videoId) {
        throw new ApiError(400, "Video Id is required")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            isPublished: !video.isPublished
        }
    }, {new: true})

    if(!updatedVideo) {
        throw new ApiError(500, "Something went wrong while updating video")
    }
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};