const jwt = require('jsonwebtoken');
const { failed } = require('../helpers/respon');

const authentication = (req, res, next) => {
  const { token } = req.headers;
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      failed(res, 401, err);
    } else {
      next();
    }
  });
};

module.exports = authentication;
