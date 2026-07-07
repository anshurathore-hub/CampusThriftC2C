import express from "express";
import Listing from "../models/Listing.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      );

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const listing = await Listing.create({
      ...req.body,
      imageUrl,
      imagePublicId,
      owner: req.user.userId,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user.userId,
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (listing.imagePublicId) {
      await cloudinary.uploader.destroy(listing.imagePublicId);
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
