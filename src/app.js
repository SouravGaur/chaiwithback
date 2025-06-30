import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
//this will seems to be like "http://localhost:8000/users/login"

//routes declaraation
app.use("/api/v1/users", userRouter);

export { app };
