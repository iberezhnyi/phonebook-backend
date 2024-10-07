import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import crypto from "node:crypto";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import { sendMailService } from "../helpers/sendMailService.js";

const { SECRET_KEY } = process.env;

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const avatarURL = gravatar.url(email);

    await sendMailService({ email, verificationToken });

    const newUser = await User.create({
      ...req.body,
      avatarURL,
      password: hashPassword,
      verificationToken,
    });

    console.log("newUser :>> ", newUser);

    res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendingEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user.verify !== false) {
      throw HttpError(400, "Verification has already been passed");
    }

    const { verificationToken } = user;

    await sendMailService({
      email,
      subject: "(Repeat message) Welcome to your contacts!",
      verificationToken,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (user.verify === false) {
      throw HttpError(401, "Your account is not verified!");
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).send({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
