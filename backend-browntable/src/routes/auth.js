const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateId = require('../utils/generateId');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup - User registration
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate color for user
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-gray-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Create user
    const user = new User({
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      avatar: name.charAt(0).toUpperCase(),
      color: randomColor
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      color: user.color
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      color: user.color
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      color: user.color
    };

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Update user
    user.name = name.trim();
    user.avatar = name.charAt(0).toUpperCase();
    await user.save();

    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      color: user.color
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// POST /api/auth/search-user - Search user by phone for invites
router.post('/search-user', authMiddleware, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      color: user.color
    };

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search user',
      error: error.message
    });
  }
});

module.exports = router; 