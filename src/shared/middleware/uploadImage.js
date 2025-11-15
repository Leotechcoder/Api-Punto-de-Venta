import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

// Subida con stream (funciona en Railway)
export const uploadToCloudinary = ({file, name}) => {

  function toUnderscore(text) {
    const textMayus =  text.trim().replace(/\s+/g, "_");
    return textMayus.toLowerCase();
  }
  const id = toUnderscore(name);

  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const options = {
      folder: "productos",
      public_id: id,
      unique_filename: false,
      overwrite: true,
    };

    const stream = cloudinary.uploader.upload_stream( 
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve({url: result.secure_url, id: result.public_id });
      }
    );
    
    stream.end(file.buffer);
  });
};

export default upload;
