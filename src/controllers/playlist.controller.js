
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, {isValidObjectId} from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "Name and Description is required");
  }

  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner: req.user._id
    })
  
    return res
            .status(201)
            .json(new ApiResponse(201, playlist, "Playlist created successfully"))

  } catch (error) {
    console.log("ERROR ", error);
    throw new ApiError(500, "Something went wrong while creating playlist")
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if(!userId) { 
    throw new ApiError(400, "User Id is required")
  }

  try {
    const playlist = await Playlist.find({owner: userId})
    

    if(!playlist) {
      throw new ApiError(404, "Playlists not found")
    }

  
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlists fetched successfully"));

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(500, "Something went wrong while fetching playlists")
  }

});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if(!playlistId) {
    throw new ApiError(400, "Playlist Id is required")
  }

  try {
    const playlist = await Playlist.findById(playlistId)
  
    if(!playlist) {
      throw new ApiError(404, "Playlist not found")
    }
  
    return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(500, "Something went wrong while fetching playlist")
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if(!playlistId) {
    throw new ApiError(400, "Playlist Id is required")
  }

  if(!videoId) {
    throw new ApiError(400, "Video Id is required")
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(
          playlistId,
          {
              $push: {
                  videos: videoId
              }
          },
          {new: true}
      )
  
      return res
              .status(200)
              .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(500, "Something went wrong while adding video to playlist")
  }

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
    if (!playlistId) {
      throw new ApiError(400, "Playlist Id is required");
    }

    if (!videoId) {
      throw new ApiError(400, "Video Id is required");
    }

    try {
        const playlist = await Playlist.findByIdAndUpdate(
          playlistId,
          {
            $pull: {
              videos: videoId,
            },
          },
          { new: true }
        );
    
        return res
          .status(200)
          .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));

    } catch (error) {
        console.log("ERROR", error);
        throw new ApiError(500, "Something went wrong while removing video from playlist");
    }

});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is required");
  }

  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  
    return res
      .status(200)
      .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"));

  } catch (error) {
    console.log("Error", error);
    throw new ApiError(500, "Something went wrong while deleting playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist{
  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is required");
  }

  if (!(name || description)) {
    throw new ApiError(400, "Name and Description is required");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    {new: true},
  )

  return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Playlist updated successfully"))
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};