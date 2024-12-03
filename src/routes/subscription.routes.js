import Router from "express";
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";

const router = Router(); 

router.route('/toggle-subscription/:channelId').post(verifyJwt, toggleSubscription)
router.route('/get-channel-subscribers/:channelId').get(verifyJwt, getUserChannelSubscribers)
router.route('/get-subscribed-channels/:subscriberId').get(verifyJwt, getSubscribedChannels)


export default router
