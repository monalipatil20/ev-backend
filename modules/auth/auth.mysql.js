const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DataTypes } = require('sequelize');
const db = require('../../config/database');

function getUserModel() {
  const sequelize = db.getSequelize();
  if (!sequelize) throw new Error('Sequelize not initialized');

  if (sequelize.models && sequelize.models.User) return sequelize.models.User;

  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    profileImage: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },
  });

  return User;
}

class AuthServiceMySQL {
  generateToken(userId, email, role) {
    return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
  }

  async registerUser(userData) {
    try {
      const User = getUserModel();
      const exists = await User.findOne({ where: { email: userData.email } });
      if (exists) {
        throw { status: 400, message: 'User already exists with this email', code: 'USER_EXISTS' };
      }

      const hashed = await bcrypt.hash(userData.password, 10);
      const user = await User.create({ ...userData, password: hashed });

      const token = this.generateToken(user.id, user.email, user.role);
      return {
        success: true,
        message: 'User registered successfully',
        data: {
          userId: user.id,
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

  async loginUser(email, password) {
    try {
      const User = getUserModel();
      const user = await User.findOne({ where: { email } });
      if (!user) throw { status: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw { status: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
      if (!user.isActive) throw { status: 403, message: 'User account is inactive', code: 'USER_INACTIVE' };

      const token = this.generateToken(user.id, user.email, user.role);
      return {
        success: true,
        message: 'Login successful',
        data: { userId: user.id, fullName: user.fullName, email: user.email, role: user.role, token },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const User = getUserModel();
      const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
      if (!user) throw { status: 404, message: 'User not found', code: 'USER_NOT_FOUND' };
      return { success: true, message: 'User profile retrieved successfully', data: user };
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      const User = getUserModel();
      await User.update(updateData, { where: { id: userId } });
      const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
      if (!user) throw { status: 404, message: 'User not found', code: 'USER_NOT_FOUND' };
      return { success: true, message: 'User profile updated successfully', data: user };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthServiceMySQL();
