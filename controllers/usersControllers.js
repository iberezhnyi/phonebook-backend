import fs from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import { resizeImg } from "../helpers/resizeImg.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const avatarDir = path.join(__dirname, "..", "public", "avatars");

export const updateSubscriptionUser = async (req, res, next) => {
  try {
    const { id: owner, subscription } = req.user;

    const { subscription: newSubscription } = req.body;

    if (subscription === newSubscription) {
      throw HttpError(400, "This rate plan is already applied!");
    }

    const result = await User.findByIdAndUpdate(
      owner,
      { subscription: newSubscription },
      { new: true }
    );

    res
      .status(200)
      .send({ email: result.email, subscription: result.subscription });
  } catch (error) {
    next(error);
  }
};

export const updateAvatarUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);

    resizeImg(resultUpload);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).send({ avatarURL });
  } catch (error) {
    next(error);
  }
};
