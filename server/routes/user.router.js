const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../midllewares/auth.middleware');

// ✅ Register Route
router.post(
  '/register',
  [    
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string'),
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
  [
        body('userId')
      .notEmpty()
      .withMessage('User ID is required')
      .isString()
      .withMessage('User ID must be a string')
  ],
  authMiddleware.userAuth,
  userController.logout
);

module.exports = router;