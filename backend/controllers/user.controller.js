import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

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
