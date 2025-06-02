const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const cloudinary = require('../config/cloudinary');
const multer = require('multer');


// register
module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ message: "email already exists" });
    }

    const user = await userModel.create({ firstName, lastName, email, password });

    if (!user) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "User creation failed" });
    }

    const token = user.generateAuthToken();

    res.status(StatusCodes.CREATED).json({ token, user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// login
module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

       const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    res.status(StatusCodes.OK).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// logout
module.exports.logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Logout successful (client should discard token)" });
};

// Get Profile
module.exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Failed to fetch profile" 
    });
  }
};

// Update Profile
module.exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    phone,
    language,
    theme,
    settings,
    bio,
    location,
    timezone
  } = req.body;

  try {
    // Validate settings object if provided
    if (settings) {
      if (typeof settings !== 'object') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Settings must be an object'
        });
      }

      const validSettings = ['emailNotifications', 'pushNotifications', 'twoFactorAuth'];
      const invalidSettings = Object.keys(settings).filter(key => !validSettings.includes(key));
      
      if (invalidSettings.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Invalid settings: ${invalidSettings.join(', ')}`
        });
      }

      // Validate boolean values
      for (const key of validSettings) {
        if (settings[key] !== undefined && typeof settings[key] !== 'boolean') {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: `Setting ${key} must be a boolean`
          });
        }
      }
    }

    // Validate language
    if (language && !['en', 'es', 'fr'].includes(language)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid language selection'
      });
    }

    // Validate theme
    if (theme && !['light', 'dark', 'system'].includes(theme)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid theme selection'
      });
    }

    const updates = {};
    
    // Only update fields that are provided and valid
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (language !== undefined) updates.language = language;
    if (theme !== undefined) updates.theme = theme;
    if (settings !== undefined) {
      updates.settings = {
        ...(req.user.settings || {}), // Keep existing settings
        ...settings // Update with new settings
      };
    }
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (timezone !== undefined) updates.timezone = timezone;

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { 
        new: true,
        runValidators: true,
        select: '-password'
      }
    );

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: "Failed to update profile" 
    });
  }
};

// Update Avatar
module.exports.updateAvatar = async (req, res) => {
  try {
    // Check if file exists in the request
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'No file uploaded. Please select an image.'
      });
    }

    // Get the file from the request
    const file = req.file;

    // Log the file details for debugging
    console.log('File details:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      buffer: file.buffer ? 'Buffer present' : 'No buffer'
    });

    // Get the user from the request (set by auth middleware)
    const user = req.user;

    // Delete old avatar if it exists
    if (user.avatar) {
      try {
        // Extract public_id from the old avatar URL
        const oldPublicId = user.avatar.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (deleteError) {
        console.error('Error deleting old avatar:', deleteError);
        // Continue with update even if delete fails
      }
    }

    // Update the user's avatar in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { avatar: file.path }, // Use the file path from multer
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User not found'
      });
    }

    // Return the updated user
    res.status(StatusCodes.OK).json({
      message: 'Avatar updated successfully',
      avatar: updatedUser.avatar
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating avatar. Please try again.'
    });
  }
};
