import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Vedio } from "../models/vedio.models.js";

const getVideoComments = asynchandler(async (req, res) => {
  //TODO: get all comments for a video
  const { vedioId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!mongoose.isValidObjectId(vedioId)) {
    throw new ApiError(400, "no vedio exist with this vedioId");
  }
  const vedioComment = await Comment.aggregate([
    {
      $match: {
        vedio: new mongoose.Types.ObjectId(vedioId),
      },
    },
    {
      $lookup: {
        from: "vedios",
        localField: "vedio",
        foreignField: "_id",
        as: "vedioComment",
      },
    },
    { $unwind: "$vedioComment" },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        "vedioComment.title": 1,
        "vedioComment._id": 1,
      },
    },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ]);
  res
    .status(200)
    .json(new ApiResponse(200, vedioComment, "here we het the vedio comment"));
});

const addComment = asynchandler(async (req, res) => {
  // TODO: add a comment to a video
  const { vedioId } = req.params;
  if (!mongoose.isValidObjectId(vedioId)) {
    throw new ApiError(400, "no vedio exist with this vedioId");
  }

  const vedio = await Vedio.findById(vedioId);
  if (!vedio) {
    throw new ApiError(400, "no vedio exist with this vedioId");
  }
  const userId = req.user?._id;

  const { content } = req.body;
  if (!(content || content.trim() === "")) {
    throw new ApiError(400, "enter something in comment cannot be empty");
  }
  const comment = await Comment.create({
    content,
    vedio: vedioId,
    owner: userId,
  });
  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment = asynchandler(
  async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!(content || content.trim() === "")) {
      throw new ApiError(400, "no content is there ");
    }
    if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "no comment exist with this commentId");
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        content,
      },
      { new: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedComment,
          "comment has been updated sucessfully"
        )
      );
  }
  // TODO: update a comment
);

const deleteComment = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "no comment exist with this commentId");
  }
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "comment deleted Successfully"));
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
