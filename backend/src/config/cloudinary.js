const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test connection
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return result;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    throw error;
  }
};

// Upload file with options
const uploadFile = async (file, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'meditrack/reports',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      ...options,
    });
    return result;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// Delete file
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

// Get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

module.exports = {
  cloudinary,
  testConnection,
  uploadFile,
  deleteFile,
  getOptimizedUrl,
};