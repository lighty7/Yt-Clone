const express = require('express');
const router = express.Router();

// Placeholder posts routes
router.get('/', (req, res) => {
  res.json({ posts: [], message: 'Posts route placeholder' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create post route placeholder' });
});

module.exports = router;
