import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const {content} = req.body;
  const {videoId} = req.params;

  if (!content.trim()) {
    throw new ApiError(400, "Content is required")
  }

  if (!videoId) {
    throw new ApiError(400, "Video id is required")
  }
  
  try {
    const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user._id
    })

    return res
            .status(201)
            .json(new ApiResponse(201, comment, "Comment successfully created"))

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(500, "Something went wrong while creating tweet")
  }
  
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const {commentId} = req.params;
  const {comment} = req.body;

  if (!commentId && !comment) {
    throw new ApiError(400, "Comment and CommentId is required")
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
          $set: {
              content: comment
          }
      },
      {new: true}
    )
  
    return res
          .status(200)
          .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))

  } catch (error) {
    console.log("ERROR", error)
    throw new ApiError(500, "Something went wrong while updating comment")
  }

});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
    const {commentId} = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment is required")
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId)
    
        return res
          .status(200)
          .json(
            new ApiResponse(200, deletedComment, "Comment deleted Successfully")
          );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting comment")
    }

});

export { getVideoComments, addComment, updateComment, deleteComment };