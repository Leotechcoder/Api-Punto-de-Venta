import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

const toUnderscore = (text) => {
  return text.trim().replace(/\s+/g, "_").toLowerCase();
};

// Genera un ID único para cada imagen
const makePublicId = (name) => {
  const base = toUnderscore(name);
  return `${base}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

// Subida a Cloudinary con Stream
export const uploadToCloudinary = ({ file, name }) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const publicId = makePublicId(name);

    const options = {
      folder: "productos",
      public_id: publicId,
      unique_filename: true,
      overwrite: false,
      resource_type: "image",
    };

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve({
        url: result.secure_url,
        id: result.public_id,
      });
    });

    stream.end(file.buffer);
  });
};

export default upload;
