import mongoose from "mongoose";
import "dotenv/config";

// connect to mongodb test database
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .catch((error) => {
    console.log(error);
  });
