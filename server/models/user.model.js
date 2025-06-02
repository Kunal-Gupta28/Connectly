const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
    match: [/^\+?[\d\s-]{10,}$/, 'Please provide a valid phone number'],
  },
  language: {
    type: String,
    enum: ['en', 'es', 'fr'],
    default: 'en',
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'dark',
  },
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  location: {
    type: String,
    default: '',
    maxlength: 100,
  },
  timezone: {
    type: String,
    default: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {

    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


userSchema.methods.generateAuthToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Static method to hash a password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);