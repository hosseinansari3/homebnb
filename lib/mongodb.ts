import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("connected to mongodb");
  } catch (error) {
    console.log("Error connectiong to mongodb", error);
  }
};
