const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_USER_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'] ;
 
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Missing token.' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = decodedToken;
    next();
  });
};
module.exports = authenticateToken;
