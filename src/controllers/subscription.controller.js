import {User} from "../models/user.model.js";
import {Subscription} from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required")
    }

    const channel = await Subscription.find({channel: channelId, subscriber: req.user._id})

    if (channel.length > 0) {
        try {
            await Subscription.findByIdAndDelete(channel[0]._id)
            return res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully"))
        } catch (error) {
            console.log("ERROR", error);
            throw new ApiError(500, "Something went wrong while unsubscribing")
        }
    } else {
        try {
            const subscribe = await Subscription.create({
                channel: channelId,
                subscriber: req.user._id
            })

            return res.status(200).json(new ApiResponse(200, subscribe, "Subscribed successfully"))
        } catch (error) {
            console.log("ERROR", error)
            throw new ApiError(500, "Something went wrong while subscribing")
        }
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel Id is required");
  }

  const subscribers = await Subscription.find({ channel: channelId })

  return res 
          .status(200)
          .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "Subscriber Id is required");
  }

  try {
    const channels = await Subscription.find({ subscriber: subscriberId })
    
  
    return res
            .status(200)
            .json(new ApiResponse(200, channels, "Channels fetched successfully"));
  } catch (error) {
    console.log("ERROR", error);
    throw new ApiError(500, "Something went wrong while fetching channels")
  }
});

export {toggleSubscription , getUserChannelSubscribers, getSubscribedChannels}