import jimp from "jimp";
import HttpError from "./HttpError.js";

const imgResize = async (imgPath) => {
  try {
    const image = await jimp.read(imgPath);
    image.resize(250, 250).write(imgPath);
    return image;
  } catch (error) {
    throw HttpError(400, error);
  }
};

export default imgResize;
