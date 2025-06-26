import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("MongoDB connection error hi h", err);
    process.exit(1);
  }
};
export default connectDB;

// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${DB_NAME}`
//     );
//     console.log(
//       `/n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
//     );
//   } catch (err) {
//     console.error("MongoDB connection error", err);
//     // throw err;// y bhi use kr skte ho execution end krne k liye but node will provide us special functionallity of process
//     process.exit(1);
//   }
// };
// export default connectDB;
