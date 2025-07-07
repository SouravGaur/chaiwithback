import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const createTweet = asynchandler(async (req, res) => {
  console.log("DEBUG: req.body =", req.body);
  try {
    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, "there is no content entered");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(400, "user does not logged in");
    }

    const tweet = await Tweet.create({
      content: content,
      owner: user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "tweet Created Successfully"));
  } catch (error) {
    throw new ApiError(400, "bhai enter hi nhi hua code m tu");
  }
});

const getUserTweets = asynchandler(async (req, res) => {
  const user = req.params.userId;
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  console.log(user);
  const tweets = await Tweet.find({ owner: req.user._id });

  if (!tweets || tweets.length === 0) {
    throw new ApiError(400, "User not created any tweet yet found");
  }
  res.status(200).json(new ApiResponse(200, tweets, "all tweets are fetched"));
});

const updateTweet = asynchandler(async (req, res) => {
  const tweetId = req.params.tweetId;
  const { updatedContent } = req.body;
  if (!updatedContent) {
    throw ApiError(401, "nothin to update no new data to be entered");
  }
  if (!tweetId) {
    throw new ApiError(400, "didn't get tweet in request");
  }
  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: updatedContent,
    },
    {
      new: true,
      runValidators: false,
    }
  );
  if (!tweet) {
    throw new ApiError(400, "give tweetId does not Exist");
  }
  res
    .status(200)
    .json(new ApiResponse(201, tweet, "tweet has been updated completly"));
});

const deleteTweet = asynchandler(async (req, res) => {
  //TODO: delete tweet
  const tweetId = req.params.tweetId;
  if (!tweetId) {
    throw new ApiError(400, "didn't get tweet in request");
  }
  const tweet = await Tweet.findByIdAndDelete(tweetId);

  res
    .status(200)
    .json(new ApiResponse(201, tweet, "tweet has been deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
