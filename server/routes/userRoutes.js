const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
const { StatusCodes } = require('http-status-codes');
const upload = require('../middlewares/upload.middleware');

// ✅ Register Route
router.post(
  '/register',
  [    
    body('firstName')
      .notEmpty()
      .withMessage('First name is required')
      .isString()
      .withMessage('First name must be a string')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .isString()
      .withMessage('Last name must be a string')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .isLength({ min: 3, max: 50 })
      .withMessage('Email must be between 3 and 50 characters')
      .notEmpty()
      .withMessage('Email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isString()
      .withMessage('Password must be a string')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters')
  ],
  userController.register
);

// ✅ Login Route
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .isLength({ min: 3, max: 50 })
      .withMessage('Email must be between 3 and 50 characters')
      .notEmpty()
      .withMessage('Email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isString()
      .withMessage('Password must be a string')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters')
  ],
  userController.login
);

// ✅ Logout Route
router.post(
  '/logout',
  authMiddleware.userAuth,
  userController.logout
);

// Get Profile Route
router.get(
  '/profile',
  authMiddleware.userAuth,
  userController.getProfile
);

// Update Profile Route
router.put(
  '/profile',
  [
    body('firstName')
      .optional()
      .isString()
      .withMessage('First name must be a string')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .optional()
      .isString()
      .withMessage('Last name must be a string')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .matches(/^\+?[\d\s-]{10,}$/)
      .withMessage('Please provide a valid phone number'),
    body('language')
      .optional()
      .isIn(['en', 'es', 'fr'])
      .withMessage('Language must be one of: en, es, fr'),
    body('theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage('Theme must be one of: light, dark, system'),
    body('settings.emailNotifications')
      .optional()
      .isBoolean()
      .withMessage('Email notifications setting must be a boolean'),
    body('settings.pushNotifications')
      .optional()
      .isBoolean()
      .withMessage('Push notifications setting must be a boolean'),
    body('settings.twoFactorAuth')
      .optional()
      .isBoolean()
      .withMessage('Two-factor authentication setting must be a boolean'),
    body('bio')
      .optional()
      .isString()
      .withMessage('Bio must be a string')
      .isLength({ max: 500 })
      .withMessage('Bio must be less than 500 characters'),
    body('location')
      .optional()
      .isString()
      .withMessage('Location must be a string')
      .isLength({ max: 100 })
      .withMessage('Location must be less than 100 characters'),
    body('timezone')
      .optional()
      .isString()
      .withMessage('Timezone must be a string'),
  ],
  authMiddleware.userAuth,
  userController.updateProfile
);

// Update Avatar Route
router.post(
  '/profile/avatar',
  authMiddleware.userAuth,
  upload,
  userController.updateAvatar
);

module.exports = router;