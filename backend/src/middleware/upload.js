// Multer memory storage for file uploads
const multer = require('multer');

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
