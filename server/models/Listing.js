import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    sellerPhone: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
    },
    condition: {
      type: String,
      default: "Good",
    },
    campus: {
      type: String,
      default: "Amity Noida Sec-125",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
