const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// Middleware-funktio tokenin verifioimiseksi
verifyToken = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token'];

  if (token) {
    // Varmistetaan, että token on voimassa ja dekoodataan se
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid or expired.',
        });
      } else {
        // Token on voimassa, ja decoded-tiedot tallennetaan pyyntöön
        req.decoded = decoded;
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
