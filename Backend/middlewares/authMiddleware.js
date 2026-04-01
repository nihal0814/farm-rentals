const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header that starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header (Format is "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the decoded ID and attach it to the request object (req.user)
      // We use .select('-password') so we don't accidentally pass the password hash along
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the actual controller logic
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };