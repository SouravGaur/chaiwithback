import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Vedio } from "../models/vedio.models.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asynchandler(async (req, res) => {
  const { vedioId } = req.params;
  if (!mongoose.isValidObjectId(vedioId)) {
    throw new ApiError(400, "Invalid vedioId");
  }
  const vedio = await Vedio.findById(vedioId);
  const user = req.user._id;

  const likedVedio = await Like.findOne({
    vedio: vedioId,
    likedBy: user,
  });
  if (likedVedio) {
    await Like.deleteOne(likedVedio._id);
    return res
      .status(200)
      .json(new ApiResponse(200, likedVedio, "Video unliked successfully"));
  } else {
    const likeVid = await Like.create({
      vedio: vedioId,
      likedBy: user,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, likeVid, "Video liked successfully"));
  }
  //TODO: toggle like on video
});

const toggleCommentLike = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid UserId");
  }
  const comment = await Vedio.findById(commentId);
  const user = req.user._id;

  const isLikedComment = await Like.findOne({
    commnet: commentId,
    likedBy: user,
  });
  if (isLikedComment) {
    await Like.findByIdAndDelete(isLikedComment._id);

    return console.log("disliked the comment");
  } else {
    const likeComment = await Like.create({
      comment: comment,
      likedBy: user,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, likeComment, "comment liked successfully"));
  }

  //TODO: toggle like on comment
});

const toggleTweetLike = asynchandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }
  const tweet = await Tweet.findById(tweetId);
  const user = req.user._id;

  const isLikedtweet = await Like.findOne({
    tweet: tweetId,
    likedBy: user,
  });
  if (isLikedtweet) {
    await Like.findByIdAndDelete(isLikedtweet._id);

    return res
      .status(200)
      .json(new ApiResponse(200, isLikedtweet, "tweet unliked successfully"));
  } else {
    const liketweet = await Like.create({
      tweet: tweet,
      likedBy: user,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, liketweet, "tweet liked successfully"));
  }

  //TODO: toggle like on tweet
});

const getLikedVideos = asynchandler(async (req, res) => {
  const user = req.user._id;
  const likedvideos = await Like.aggregate([
    {
      $match: {
        comment: null,
        tweet: null,
        likedBy: user,
      },
    },
    {
      $lookup: {
        from: "vedios",
        localField: "vedio",
        foreignField: "_id",
        as: "likedvideoDetails",
      },
    },
    {
      $unwind: "$likedvideoDetails",
    },
    {
      $project: {
        title: "$likedvideoDetails.title",
        description: "$likedvideoDetails.description",
        videoFile: "$likedvideoDetails.videoFile",
        duration: "$likedvideoDetails.duration",
        thumbnail: "$likedvideoDetails.thumbnail",
        owner: "$likedvideoDetails.owner",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedvideos, "liked videos fetched successFully !")
    );

  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
