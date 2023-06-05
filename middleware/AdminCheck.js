const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_ADMIN_SECRET;

const adminCheck = (req, res, next) => {
  const token = req.headers['x-access-token'] ;
 
  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    // Attach the decoded token payload to the request object
    req.user = decoded;
    next();
  });
};
module.exports = adminCheck;
