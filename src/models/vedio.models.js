import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const vedioSchema = new mongoose.Schema(
  {
    vedioFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    decription: {
      type: String,
      required: true,
    },
    duuration: {
      type: Number, //cloudnary se milega
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);
vedioSchema.piugin(mongooseAggregatePaginate);
export const vedio = mongoose.model("Vedio", vedioSchema);
