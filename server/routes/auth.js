import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import Listing from "../models/Listing.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3–20 characters and can contain only letters, numbers and underscores.",
      });
    }

    if (!email.endsWith("@s.amity.edu") && !email.endsWith("@amity.edu")) {
      return res.status(400).json({
        message: "Only Amity students can register.",
      });
    }

    const existingUser = await User.findOne({ email });

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken.",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        campus: user.campus,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/delete-account", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const listings = await Listing.find({ owner: userId });

    for (const listing of listings) {
      if (listing.imagePublicId) {
        await cloudinary.uploader.destroy(listing.imagePublicId);
      }
    }

    await Listing.deleteMany({ owner: userId });

    await User.findByIdAndDelete(userId);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, phone, campus, bio } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit Indian phone number.",
      });
    }

    if (bio && bio.length > 200) {
      return res.status(400).json({
        message: "Bio cannot exceed 200 characters.",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser._id.toString() !== req.user.userId) {
      return res.status(400).json({
        message: "Username is already taken.",
      });
    }

    user.username = username;
    user.phone = phone;
    user.campus = campus;
    user.bio = bio;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        campus: user.campus,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Change Password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from current password.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
