import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favorites");

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/:listingId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.favorites.includes(req.params.listingId)) {
      user.favorites.push(req.params.listingId);
      await user.save();
    }

    res.json({
      message: "Added to favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:listingId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.listingId,
    );

    await user.save();

    res.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;