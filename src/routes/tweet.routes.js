import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweet,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJwt, createTweet);
router.route("/update-tweet/:tweetId").patch(verifyJwt, updateTweet);
router.route("/get-user-tweets").get(verifyJwt, getUserTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJwt, deleteTweet);

export default router;
