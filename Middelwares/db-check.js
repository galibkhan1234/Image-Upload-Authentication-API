const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({ success: false, message: 'Database unavailable. Try again later.' });
};
