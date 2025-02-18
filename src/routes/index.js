const express = require('express');
const { processTick } = require('../controllers/tickController');
const path = require('path');

const router = express.Router();

// Serve integration.json
router.get('/integration.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../config/integration.json'));
});

// Tick endpoint
router.post('/tick', processTick);

module.exports = router;
