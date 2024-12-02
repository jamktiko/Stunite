const jwt = require('jsonwebtoken');
require('dotenv').config();

// Funktio tokenin luomiseen käyttäjätiedosta
createToken = (user) => {
  const payload = {
    username: user.username,
  };

  console.log(payload);

  // Luodaan token käyttäen payloadia, ympäristömuuttujaa salaisena avaimena ja määritellään sen voimassaoloaika
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 60 * 4, // Tokenin voimassaoloaika on 4 tuntia (3600 sekuntia * 4)
  });

  return token;
};

module.exports = createToken;
