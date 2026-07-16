import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },

    campus: {
      type: String,
      default: "Amity Noida Sec-125",
    },

    bio: {
      type: String,
      default: "",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
