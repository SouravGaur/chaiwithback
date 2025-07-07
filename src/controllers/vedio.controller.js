import mongoose, { isValidObjectId } from "mongoose";

import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Vedio } from "../models/vedio.models.js";

const getAllVideos = asynchandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //pipeline create kri
  const pipeline = [];

  //Filter by Search Query
  if (query) {
    pipeline.push({
      $match: {
        title: { $regex: query, $options: "i" },
      },
    });
  }
  if (userId) {
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  pipeline.push({
    $match: {
      isPublished: true,
    },
  });

  // 🔀 Sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortOptions });

  // 🧮 Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });

  // 👤 Join owner data from User model
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  });
  pipeline.push({
    $addFields: {
      owner: { $first: "$owner" },
    },
  });

  const videos = await Vedio.aggregate(pipeline);

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));

  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asynchandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      throw new ApiError("we are unbale to fetch title");
    }
    if (!description) {
      throw new ApiError("we are unbale to fetch description");
    }
    console.log(description);

    if (
      [title, description].some((field) => {
        return field?.trim() === "";
      })
    ) {
      throw new ApiError(400, "there is empty field is entered");
    }
    const vedioLocalPath = req.files?.vedioFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!vedioLocalPath) {
      throw new ApiError(400, "thumbnail or vedio something is missing");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "thumbnail or vedio something is missing");
    }

    const vedio = await uploadOnCloudinary(vedioLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!vedio) {
      throw new ApiError(400, "vedio.url not found not uploded on cloudinary");
    }
    if (!thumbnail) {
      throw new ApiError(400, "thumbnail.url. not uploded on cloudinary");
    }
    console.log("vedio :", vedio);
    console.log("thumbnail:", thumbnail);

    const vedioDoc = await Vedio.create({
      vedioFile: vedio.url,
      thumbnail: thumbnail.url,
      owner: req.user._id,
      title,
      description: description,
      duration: vedio.duration,
    });

    res
      .status(200)
      .json(new ApiResponse(200, vedioDoc, "vedio published Successfully "));
  } catch (error) {
    throw new ApiError(400, error, "we coming directly into catch block");
  }
});

const getVideoById = asynchandler(async (req, res) => {
  const { vedioId } = req.params;
  if (!vedioId) {
    throw new ApiError(400, "there is no video id present");
  }
  const vedio = await Vedio.findById(vedioId);

  if (!vedio) {
    throw new ApiError(400, "no such vedio with this Id exist");
  }
  res
    .status(200)
    .json(new ApiResponse(200, vedio, "vedio fetched by Id successfully"));

  //TODO: get video by id
});

const updateVideo = asynchandler(async (req, res) => {
  const { vedioId } = req.params;
  if (!vedioId) {
    throw new ApiError(400, "there is no video id present");
  }

  const thumbnaillocalPath = req.file?.path;
  if (!thumbnaillocalPath) {
    throw new ApiError(400, " thumbnail  is missing");
  }
  const thumbnail = await uploadOnCloudinary(thumbnaillocalPath);

  const thumbnailupdated = await Vedio.findByIdAndUpdate(
    vedioId,
    {
      thumbnail: thumbnail.url,
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        thumbnailupdated,
        "thumbnail has been updated Successfullly"
      )
    );
});

const deleteVideo = asynchandler(async (req, res) => {
  const { vedioId } = req.params;
  if (!vedioId) {
    throw new ApiError(400, "there is no video id present");
  }
  const vediodel = await Vedio.findByIdAndDelete(vedioId);

  res
    .status(200)
    .json(
      new ApiResponse(200, vediodel, "vedio has been deleted Successfullly")
    );

  //TODO: delete video
});

const togglePublishStatus = asynchandler(async (req, res) => {
  const { vedioId } = req.params;
  if (!vedioId) {
    throw new ApiError(400, "there is no video id present");
  }

  const vedio = await Vedio.findById(vedioId);
  if (!vedio) {
    throw new ApiError(400, "there is no video found");
  }
  vedio.isPublished = !vedio.isPublished;
  await vedio.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, vedio.isPublished, "ispublished Status has been set")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
