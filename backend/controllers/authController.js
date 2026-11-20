const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const ActivityModel = require('../models/activityModel');

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const sendTokenResponse = (user, statusCode, res, message = 'Authenticated successfully') => {
  const token = signToken(user);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  // Exclude password from response
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    created_at: user.created_at
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: sanitizedUser
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    try {
      await ActivityModel.log('ADMIN_LOGIN', `Admin '${user.name}' logged in.`, user.id);
    } catch (logErr) {
      console.warn('[Activity Log Warning]:', logErr.message);
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully!');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication: ' + error.message,
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    if (req.user) {
      await ActivityModel.log('ADMIN_LOGOUT', `Admin '${req.user.name}' logged out.`, req.user.id);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout.'
    });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile.'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Fetch existing user to verify password if password change is requested
    const fullUser = await UserModel.findByEmail(req.user.email);

    let hashedPassword = null;
    if (newPassword && newPassword.trim() !== '') {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password.'
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match our records.'
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.'
        });
      }
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Check if new email is taken by someone else
    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another account.'
        });
      }
    }

    const updatedUser = await UserModel.updateProfile(userId, {
      name: name || req.user.name,
      email: email || req.user.email,
      password: hashedPassword
    });

    await ActivityModel.log('PROFILE_UPDATE', `Admin updated account profile settings.`, userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  updateProfile
};
