require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (data, expiresIn = '1h') => {
  const options = {
    expiresIn,
  };
  return jwt.sign(data, process.env.JWT_SECRET_KEY, options);
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);

module.exports = { generateToken, verifyToken };
