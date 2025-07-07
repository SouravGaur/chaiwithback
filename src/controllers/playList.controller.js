import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Vedio } from "../models/vedio.models.js";

const createPlaylist = asynchandler(async (req, res) => {
  const { name, description, vedioIds } = req.body;
  if (
    [name, description].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "there is empty value Entered");
  }
  if (vedioIds.length === 0) {
    throw new ApiError(400, "there is no vedio in playlist");
  }
  const validVideos = await Vedio.find({ _id: { $in: vedioIds } });
  if (validVideos.length !== vedioIds.length) {
    throw new ApiError(400, "One or more video IDs are invalid");
  }

  const playlist = await PlayList.create({
    vedios: vedioIds,
    owner: req.user._id,
    description,
    name,
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created Successfully"));

  //TODO: create playlist
});

const getUserPlaylists = asynchandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userid is not present");
  }
  const userPlaylist = PlayList.find({ owner: userId }).populate(vedios);
  //TODO: get user playlists
  res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "userplaylist fetched Successfully")
    );
});

const getPlaylistById = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "playList is not present");
  }
  const playList = await PlayList.findById(playlistId);
  res
    .status(200)
    .json(new ApiResponse(200, playList, "playlist fetched Successfully"));

  //TODO: get playlist by id
});

const addVideoToPlaylist = asynchandler(async (req, res) => {
  const { playlistId, vedioId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, " there is no playlistId is here ");
  }
  if (!vedioId) {
    throw new ApiError(400, " there is no vedioId is here ");
  }
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, " there is no playList with this name Exist ");
  }
  const vedio = await Vedio.findById(vedioId);
  if (!vedio) {
    throw new ApiError(400, " there is no vedio with this name Exist ");
  }

  if (playlist.vedios.includes(vedioId)) {
    throw new ApiError(400, "Video already exists in the playlist");
  }

  playlist.getPopulatedPaths(vedioId);
  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "vedio added playlist Successfully"));
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
  const { playlistId, vedioId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, " there is no playlistId is here ");
  }
  if (!vedioId) {
    throw new ApiError(400, " there is no vedioId is here ");
  }
  if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid or missing playlistId");
  }
  if (!vedioId || !mongoose.isValidObjectId(vedioId)) {
    throw new ApiError(400, "Invalid or missing vedioId");
  }
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, " there is no playList with this name Exist ");
  }
  if (playlist.vedios.includes(vedioId)) {
    console.log("vedio existed");
  }
  const updatedPlaylist = await PlayList.findByIdAndUpdate(
    playlistId,
    { $pull: { vedios: vedioId } }, // ← this removes the videoId from the array
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "vedio removed Successfully"));

  // TODO: remove video from playlist
});

const deletePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, " there is no playList with this name Exist ");
  }
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, " invalodId entered");
  }
  const existingPlaylist = await PlayList.findById(playlistId);
  if (!existingPlaylist) {
    throw new ApiError(404, "No playlist found with this ID");
  }
  const delplayList = await PlayList.findByIdAndDelete(playlistId);
  res
    .status(200)
    .json(new ApiResponse(200, delplayList, "playlist have been removed"));
});

const updatePlaylist = asynchandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId) {
    throw new ApiError(400, " there is no playList with this name Exist ");
  }
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, " invalodId entered");
  }
  if (!(name || description)) {
    throw new ApiError(400, " there is no name and Description we get ");
  }
  const existingPlaylist = await PlayList.findById(playlistId);
  if (!existingPlaylist) {
    throw new ApiError(404, "No playlist found with this ID");
  }
  const updatedPlaylist = await PlayList.findByIdAndUpdate(
    playlistId,
    {
      name,
      description,
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "we have updated the playlist")
    );

  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
