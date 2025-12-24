// Helpers/cloudnary-helper.js
const cloudnary = require('../Config/cloundnar.js');

const uploadToCloudnary = async (filePath) => {
  try {
    const result = await cloudnary.uploader.upload(filePath, {
      folder: 'user-avatars'
    });

    // ✅ Unified return shape
    return {
      public_id: result.public_id,
      url: result.secure_url
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

module.exports = uploadToCloudnary;
