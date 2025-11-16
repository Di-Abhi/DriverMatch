import cloudinary from "../lib/config";
import streamifier from "streamifier";

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = "drivematch/licenses"
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
