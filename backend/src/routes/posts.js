const express = require('express');
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // Increased to 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for video field'));
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for thumbnail field'));
      }
    } else {
      cb(null, true);
    }
  }
});

// GET /api/posts - Get all videos (ranked)
router.get('/', asyncHandler(PostController.getAllPosts));

// GET /api/posts/:id - Get video by ID
router.get('/:id', asyncHandler(PostController.getPostById));

// GET /api/posts/stream/:id - Stream video with Range support
router.get('/stream/:id', PostController.streamVideo);

// POST /api/posts - Upload new video
router.post('/',
  authMiddleware,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  asyncHandler(PostController.createPost)
);

module.exports = router;
