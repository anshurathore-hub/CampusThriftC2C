import express from "express";
import Listing from "../models/Listing.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

router.post("/", upload.single("image"), async (req, res) => {
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
    });

    res.status(201).json(listing);
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

router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

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

router.put("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(listing);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
