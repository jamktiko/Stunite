const jwt = require('jsonwebtoken');
require('dotenv').config();

createToken = (user) => {
  const payload = {
    username: user.username,
    isadmin: user.isadmin,
  };
  console.log(payload);
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 60 * 4, // expiroituu 4 tunnissa
  });
  // const decodedtoken = jwt.decode(token);
  // console.log(decodedtoken);
  return token;
};

module.exports = createToken;
