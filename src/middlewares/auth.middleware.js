import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // console.log("token", token);

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log("decoded token", decodedToken);
    // console.log("decoded ID", decodedToken._id);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    // console.log("usre under auth", user);

    if (!user) {
      //dicuss about frontend
      throw new ApiError(401, "Invalid Access TOKEN");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "unvalid Access");
  }
});
