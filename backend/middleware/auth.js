const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

  try {

    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        msg: 'No token'
      });
    }

    const cleanToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(
      cleanToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      msg: 'Invalid token'
    });

  }

};