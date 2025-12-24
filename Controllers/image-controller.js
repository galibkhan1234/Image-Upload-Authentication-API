const Image = require('../Models/image');
const uploadToCloudnary = require('../Helpers/cloudnary-helper.js');
const cloudnary = require('../Config/cloundnar.js');

const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalImages,
      data: images
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
};

// Upload image controller
const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.userInfo && req.userInfo.userId;

    const uploaded = await uploadToCloudnary(req.file.path);

    const newImage = new Image({
      url: uploaded.url,
      publicId: uploaded.public_id,
      description: req.body.description || '',
      uploadedBy: userId
    });

    await newImage.save();

    res.status(201).json({ success: true, data: newImage });
  } catch (error) {
    console.error('uploadImageController error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// Delete image controller
const deleteImageController = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Remove from cloudinary
    try {
      if (image.publicId) {
        await cloudnary.uploader.destroy(image.publicId);
      }
    } catch (err) {
      console.error('Cloudinary destroy error:', err);
    }

    await image.remove();

    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('deleteImageController error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

module.exports = { uploadImageController, fetchImageController, deleteImageController };