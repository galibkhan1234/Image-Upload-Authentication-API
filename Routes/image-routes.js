const express = require('express');
const multer = require('multer');
const authMiddleware = require('../Middelwares/auth-middelware.js');
const isAdminUser = require('../Middelwares/admin-middelware.js');
const uploadMiddleware = require('../Middelwares/upload-middelware.js');
const { 
  uploadImageController,
  fetchImageController,
  deleteImageController 
} = require('../Controllers/image-controller.js');

const router = express.Router();

router.post('/upload', authMiddleware, isAdminUser, (req, res) => {
  uploadMiddleware.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {

        return res.status(413).json({
           success: false, 
           message: 'File too large. Max 10 MB' 
          });
      }
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }

    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }

    // File uploaded successfully, call controller
    uploadImageController(req, res);
  });
});

//to get all the images

router.get ('/get',authMiddleware, fetchImageController);

//dele image route //
router.delete("/:id",authMiddleware, isAdminUser, deleteImageController);

module.exports = router;
