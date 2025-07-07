import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // to store data temperory on server
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.router.js";
import tweetRouter from "./routes/tweet.router.js";
import playlistRouter from "./routes/playlist.routes.js";
import vedioRouter from "./routes/vedio.router.js";
import likeRouter from "./routes/like.router.js";
import commentRouter from "./routes/comment.router.js";
import subscriptionRouter from "./routes/subscripton.router.js";
//this will seems to be like "http://localhost:8000/users/login"

//routes declaraation
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/vedio", vedioRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/subscription", subscriptionRouter);
export { app };
