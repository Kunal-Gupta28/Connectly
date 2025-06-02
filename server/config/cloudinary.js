const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { StatusCodes } = require('http-status-codes');

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(() => console.log('Cloudinary connection successful'))
  .catch(error => {
    console.error('Cloudinary connection failed:', error);
    throw new Error('Failed to connect to Cloudinary');
  });

// Configure Cloudinary Storage
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
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error('Multer upload error:', err);
          reject(err);
        } else {
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

// Export just the cloudinary instance
module.exports = cloudinary; 