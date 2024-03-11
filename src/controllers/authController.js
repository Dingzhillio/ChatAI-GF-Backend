import asyncHandler from "express-async-handler";
import User from "../models/usersModel.js";
import createToken from "../utils/auth.service.js";
import bcrypt from "bcrypt";
import { isEmpty } from "../utils/utils.js";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userInfo = await User.findOne({ email: email });

  if (userInfo) {
    res.status(405);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  const tokenData = createToken(user._id);

  if (user) {
    res.status(201).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userToken: tokenData,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(409).json({ message: "User do not exit" });
    throw new Error("This email is not found");
  }

  const isPasswordMatching = await bcrypt.compare(password, user.password);
  if (!isPasswordMatching) {
    res.status(409).json({ message: "Invaild password" });
    throw new Error("Password is invalid");
  }

  const tokenData = createToken(user._id);

  if (user && isPasswordMatching) {
    res.status(200).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userToken: tokenData,
      },
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    res.status(409).json({ message: "UserData is empty" });
    throw new Error("UserData is empty");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error(`This email ${email} was not found`);
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    message: "logout",
  });
});

const fetch = asyncHandler(async (req, res) => {
  const user_id = req.query.user_id;

  const userInfo = await User.findById(user_id);

  if(!userInfo) {
    throw new Error("UserData is empty");
  }
  res.status(200).json({
    _id: userInfo._id,
    name: userInfo.name,
    remainTime: userInfo.remainTime
  })
})

export { signup, login, logout, fetch };
