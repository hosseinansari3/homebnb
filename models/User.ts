import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    persianName: {
      type: String,
    },
    email: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    hashedPassword: {
      type: String,
    },
    favoriteIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.Users || model("Users", userSchema);
export default User;
