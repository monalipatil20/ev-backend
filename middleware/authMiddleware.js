// JWT authentication guard used by protected API routes.
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next(new ApiError(401, 'Authorization token missing', 'NO_TOKEN'));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ApiError(401, 'User no longer exists', 'USER_NOT_FOUND'));
    }

    req.user = user;
    req.user.userId = user._id.toString();
    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required', 'UNAUTHENTICATED'));
  }

  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required', 'ADMIN_ONLY'));
  }

  return next();
};

module.exports = {
  protect,
  adminOnly,
};
