const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const userModel = require('../models/user.model');

module.exports.userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Authentication required. Please login.' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Authentication required. Please login.' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id).select('-password');
      
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 
          message: 'User not found. Please login again.' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: 'Invalid token. Please login again.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Authentication failed. Please try again.' 
    });
  }
};