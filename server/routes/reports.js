import express from "express";
import Report from "../models/Report.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create Report
router.post("/", auth, async (req, res) => {
  try {
    const { listingId, reason, message } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Prevent reporting your own listing
    if (listing.owner.toString() === req.user.userId) {
      return res.status(400).json({
        message: "You cannot report your own listing.",
      });
    }

    const report = await Report.create({
      listing: listingId,
      reportedBy: req.user.userId,
      reason,
      message,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all reports (Admin - future use)
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("listing")
      .populate("reportedBy", "username email");

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;