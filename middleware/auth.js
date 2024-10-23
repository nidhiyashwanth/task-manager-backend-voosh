const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // User is authenticated via Google OAuth
      req.userId = req.user._id;
      return next();
    }

    // Check for JWT token
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
