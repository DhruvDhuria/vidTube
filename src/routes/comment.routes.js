import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-comment/:videoId').post(verifyJwt,addComment)
router.route('/update-comment/:commentId').patch(verifyJwt, updateComment)
router.route('/delete-comment/:commentId').delete(verifyJwt, deleteComment)

export default router