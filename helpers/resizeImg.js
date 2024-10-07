import Jimp from "jimp";
import HttpError from "./HttpError.js";

export const resizeImg = async (resultUpload) => {
  return await Jimp.read(resultUpload, (err, avatar) => {
    if (err) throw HttpError(400);

    avatar.resize(250, 250).write(resultUpload);
  });
};
