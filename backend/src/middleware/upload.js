const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, JPEG, PNG, DOC, DOCX, TXT files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Upload multiple files
const uploadMultiple = upload.array('files', 5);

// Upload to cloudinary
const uploadToCloudinary = async (file, options = {}) => {
  try {
    const result = await cloudinary.uploadFile(file.buffer, {
      folder: options.folder || 'meditrack/reports',
      public_id: options.publicId,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      ...options,
    });

    return {
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      fileSize: result.bytes,
      fileType: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('File upload failed. Please try again.');
  }
};

// Delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.deleteFile(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('File deletion failed.');
  }
};

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Maximum size is 10MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  next();
};

module.exports = {
  upload,
  uploadMultiple,
  uploadToCloudinary,
  deleteFromCloudinary,
  handleUploadError,
};