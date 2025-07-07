import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const toggleSubscription = asynchandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channel Id");
  }

  const userId = req.user._id;
  if (channelId === String(userId)) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }
  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });
  if (isSubscribed) {
    const removeSubscriber = await Subscription.findByIdAndDelete(
      isSubscribed._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, removeSubscriber, "Unsubscribed successfully")
      );
  } else {
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });
    res
      .status(200)
      .json(new ApiResponse(200, newSubscription, "user subscribed"));
  }

  // TODO: toggle subscription
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channel Id");
  }
  const subscriberList = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberList",
      },
    },
    { $unwind: "$subscriberList" },
    {
      $project: {
        _id: 1,
        subscriber: "$subscriberList._id",
        channel: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberList,
        "we fetched the subscriberlist of a channel"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError(400, "invalid subscriber Id");
  }
  const subscribedChannelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelList",
      },
    },
    { $unwind: "$channelList" },
    {
      $project: {
        _id: 1,
        channel: "$channelList._id",
        subscriber: 1,
        name: "$channelList.fullname",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannelList,
        "we fetched the subscribedChannel list of a user"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
