const cloudinary = require("../lib/config");
const streamifier = require("streamifier");

/**
 * Upload buffer to Cloudinary and return result object
 * folder is optional, e.g. 'drivematch/licenses'
 */
function uploadBufferToCloudinary(buffer, folder = "drivematch/licenses") {
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

module.exports = {
  uploadBufferToCloudinary,
};
