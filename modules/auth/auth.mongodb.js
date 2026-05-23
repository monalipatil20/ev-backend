const jwt = require('jsonwebtoken');
const Auth = require('./auth.model');

class AuthServiceMongo {
  // Generate JWT Token
  generateToken(userId, email, role) {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  }

  // Register User
  async registerUser(userData) {
    try {
      const userExists = await Auth.findOne({ email: userData.email });
      if (userExists) {
        throw {
          status: 400,
          message: 'User already exists with this email',
          code: 'USER_EXISTS',
        };
      }

      const user = await Auth.create(userData);
      const token = this.generateToken(user._id, user.email, user.role);

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Login User
  async loginUser(email, password) {
    try {
      const user = await Auth.findOne({ email }).select('+password');
      if (!user) {
        throw {
          status: 401,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        };
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw {
          status: 401,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        };
      }

      if (!user.isActive) {
        throw {
          status: 403,
          message: 'User account is inactive',
          code: 'USER_INACTIVE',
        };
      }

      const token = this.generateToken(user._id, user.email, user.role);

      return {
        success: true,
        message: 'Login successful',
        data: {
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const user = await Auth.findById(userId).select('-password');
      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update User Profile
  async updateUserProfile(userId, updateData) {
    try {
      const user = await Auth.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'User profile updated successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthServiceMongo();
