const express = require('express');

// For now, mount existing route files to avoid breaking behavior.
// We can later migrate these into src/modules/*.
const authRoutes = require('./auth');
const postsRoutes = require('./posts');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);

module.exports = router;


