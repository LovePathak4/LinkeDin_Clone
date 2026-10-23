
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    profilePicture: {
      type: String,
      default: "default.jpg",
    },

    token: {
      type: String,
      default: "",
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
