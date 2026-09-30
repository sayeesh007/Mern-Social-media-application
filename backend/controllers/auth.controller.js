import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genCookie from "../lib/genCookie.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.test(regex)) res.status(400).json({ error: "Invalid email" });

    const existingUser = User.findOne({ username });
    if (existingUser)
      res.status(400).json({ error: "Username allready exists" });

    const existingEmail = User.findOne({ email });
    if (existingEmail)
      res.status(400).json({ error: "E-mail allready exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      genCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({
        error: "Invalid user Data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(400).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const comparePass = await bcrypt.compare(password, user?.password || "");

    if (!user || !comparePass)
      res.status(404).json({ error: "username or password is incorrect" });

    await genCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: "0",
    });
    res.status(200).json({ message: "Logout out Sucessfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getme controller", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
