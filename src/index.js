// require("dotenv").config({ path: "./env" });
// In your main JavaScript file (e.g., index.js)

import "dotenv/config"; // Or require('dotenv').config() for older CommonJS modules
// import { config } from "dotenv";
import connectDB from "./db/index.js";
// config({
//   path: "./.env",
// });
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port `);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!!", err);
  });

// import express from "express";

// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("erorr", (error) => {
//       console .log("ERROR", error);
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw error;
//   }
// })();
//
