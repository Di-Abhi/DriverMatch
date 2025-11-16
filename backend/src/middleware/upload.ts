import multer from "multer";

class UploadConfig {
  private storage = multer.memoryStorage();

  public upload = multer({
    storage: this.storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  });
}

export default new UploadConfig().upload;
