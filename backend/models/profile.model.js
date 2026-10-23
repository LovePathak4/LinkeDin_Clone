
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      default: "",
      trim: true,
    },
    degree: {
      type: String,
      default: "",
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const workSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
      trim: true,
    },
    position: {
      type: String,
      default: "",
      trim: true,
    },
    years: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    currentPost: {
      type: String,
      default: "",
      trim: true,
    },

    pastWork: {
      type: [workSchema],
      default: [],
    },

    education: {
      type: [educationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
