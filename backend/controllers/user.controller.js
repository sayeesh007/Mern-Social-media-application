import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  if (!username) res.status(404).json({ error: "User not found" });

  try {
    const user = await User.findById({ username }).select("-password");
    if (!user) res.status(404).json({ error: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("error in getUserProfile controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    if (id === userId)
      res.status(400).json({ error: "Cannot follow or Unfollow yourself" });

    const searchedUser = await User.findById({ id }).select("-password");
    const currentUser = await User.findById({ userId }).select("-password");

    if (!searchedUser || !currentUser)
      res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });
      res.status(200).json({ message: "User UnFollowed Successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        to: id,
        from: userId,
      });

      await newNotification.save();

      res.status(200).json({ message: "User Followed Successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const sampleUsers = await User.aggregate(
      { $match: { _id: { $ne: userId } } },
      { $sample: { $size: 10 } },
    );

    const filteredUsers = sampleUsers.filter(
      (user) => !usersFollowedByMe.includes(user_id),
    );

    const suggestUsers = filteredUsers.slice(0, 4);

    res.status(200).json(suggestUsers);
  } catch (error) {
    console.log("Error in getSuggestedUser controller ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (res, req) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) res.status(404).json({ error: "User not found" });

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ error: "Please Provide both current and new password" });
    }

    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(user.password, currentPassword);
      if (!match)
        res.status(400).json({ error: "Current password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0],
        );
      }
      const uploaded = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploaded.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0],
        );
      }
      const uploaded = await cloudinary.uploader.upload(coverImg);
      user.coverImg = uploaded.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    user = await user.save();

    user.password = null;

    res.status(200).json(user);
    
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
