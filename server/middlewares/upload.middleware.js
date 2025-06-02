const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { StatusCodes } = require('http-status-codes');

// Log cloudinary instance for debugging
console.log('Cloudinary instance:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'present' : 'missing',
  api_secret: cloudinary.config().api_secret ? 'present' : 'missing'
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'connectly/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    resource_type: 'image',
    invalidate: true // Invalidate CDN cache after upload
  }
});

// Create multer upload instance with error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Updated allowed types to include JPG
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG and GIF are allowed.'));
    }
  }
}).single('avatar'); // Use single upload with 'avatar' field name

// Wrap multer upload in a promise for better error handling
const uploadMiddleware = async (req, res, next) => {
  try {
    // Log request details for debugging
    console.log('Upload request:', {
      headers: req.headers,
      files: req.files,
      body: req.body
    });

    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error('Multer upload error:', err);
          reject(err);
        } else {
          // Log successful upload details
          console.log('Upload successful:', {
            file: req.file,
            body: req.body
          });
          resolve();
        }
      });
    });
    next();
  } catch (error) {
    console.error('Upload middleware error:', error);
    if (error.name === 'MulterError') {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Too many files. Please upload only one image.'
        });
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid field name. Please use "avatar" field.'
        });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Upload error: ${error.message}`
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error uploading file. Please try again.'
    });
  }
};

module.exports = uploadMiddleware; 