const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

verifyToken = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid or expired.',
        });
      } else {
        req.decoded = decoded; // Voit käyttää tätä käyttäjän tiedoissa
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token provided.',
    });
  }
};

module.exports = verifyToken;
