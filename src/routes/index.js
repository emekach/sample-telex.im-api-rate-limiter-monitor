const express = require('express');

const path = require('path');

const router = express.Router();

module.exports = (req, res) => {
  res.sendFile(path.resolve('../config/integration.json'));
};
module.exports = router;
