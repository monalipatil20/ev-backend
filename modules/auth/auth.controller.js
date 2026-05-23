const authService = require('./auth.service');

class AuthController {
  // Register
  async register(req, res, next) {
    try {
      const { fullName, email, phoneNumber, password, role } = req.body;

      // Basic validation
      if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await authService.registerUser({
        fullName,
        email,
        phoneNumber,
        password,
        role: role || 'user',
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await authService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Profile
  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await authService.getUserProfile(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const updateData = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const result = await authService.updateUserProfile(userId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
