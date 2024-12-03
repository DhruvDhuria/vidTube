import { Router } from "express";
import {deleteVideo, getVideoById, publishAVideo, updateVideo, getAllVideos} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/publish-video").post(
  verifyJwt,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/get-all-videos").get(verifyJwt, getAllVideos)

router.route("/get-video/:videoId").get(verifyJwt, getVideoById)
router.route("/update-video/:videoId").patch(verifyJwt, updateVideo)
router.route("/delete-video/:videoId").delete(verifyJwt, deleteVideo)

export default router