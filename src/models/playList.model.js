import mongoose from "mongoose";
const playListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vedios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vedio",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const PlayList = mongoose.model("PlayList", playListSchema);
