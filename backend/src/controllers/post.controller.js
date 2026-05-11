const { prisma } = require('../config/prisma');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const fs = require('fs');
const path = require('path');

class PostController {
  /**
   * Get all posts with user information and ranked by engagement
   */
  static async getAllPosts(req, res) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: { comments: true }
          }
        }
      });

      // Implement ranking algorithm: score = (likes * 1.5) - (dislikes * 1) + (comments * 2) + (views * 0.1)
      const rankedPosts = posts.map(post => {
        const commentCount = post._count?.comments || 0;
        const score = (post.likes * 1.5) - (post.dislikes * 1) + (commentCount * 2) + (post.views * 0.1);

        const serializedPost = { ...post };
        serializedPost.id = post.id.toString();
        serializedPost.userId = post.userId.toString();
        if (serializedPost.user) {
          serializedPost.user.id = post.user.id.toString();
        }
        serializedPost.score = score;
        return serializedPost;
      }).sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        posts: rankedPosts
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch posts'
      });
    }
  }

  /**
   * Stream video with Range support for bandwidth management
   */
  static async streamVideo(req, res) {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: { id: BigInt(id) }
      });

      if (!post || !post.videoUrl) {
        return res.status(404).json({ success: false, message: 'Video not found' });
      }

      const videoPath = path.join(__dirname, '../../', post.videoUrl);
      if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ success: false, message: 'Video file not found' });
      }

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      console.error('Error streaming video:', error);
      res.status(500).json({ success: false, message: 'Streaming error' });
    }
  }

  /**
   * Get post by ID
   */
  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      let currentUserId = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, env.jwtSecret);
          currentUserId = decoded.userId;
        } catch (e) {
          // Ignore invalid token
        }
      }

      const post = await prisma.post.findUnique({
        where: { id: BigInt(id) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              _count: {
                select: { subscribers: true }
              }
            }
          }
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Increment views
      await prisma.post.update({
        where: { id: BigInt(id) },
        data: { views: { increment: 1 } }
      });

      let userInteraction = null;
      let isSubscribed = false;

      if (currentUserId) {
        const interaction = await prisma.like.findUnique({
          where: {
            postId_userId: {
              postId: BigInt(id),
              userId: BigInt(currentUserId)
            }
          }
        });
        userInteraction = interaction ? interaction.type : null;

        const sub = await prisma.subscription.findUnique({
          where: {
            subscriberId_subscribedToId: {
              subscriberId: BigInt(currentUserId),
              subscribedToId: post.userId
            }
          }
        });
        isSubscribed = !!sub;
      }

      const serializedPost = { ...post };
      serializedPost.id = post.id.toString();
      serializedPost.userId = post.userId.toString();
      if (serializedPost.user) {
        serializedPost.user.id = post.user.id.toString();
        serializedPost.user.subscriberCount = post.user._count.subscribers;
      }

      serializedPost.userInteraction = userInteraction;
      serializedPost.isSubscribed = isSubscribed;

      res.json({
        success: true,
        post: serializedPost
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post'
      });
    }
  }

  /**
   * Create a new post
   */
  static async createPost(req, res) {
    try {
      const { content, description, duration } = req.body;
      const userId = req.user.id;

      const videoUrl = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;
      const thumbnailUrl = req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null;

      if (!videoUrl) {
        return res.status(400).json({
          success: false,
          message: 'Video file is required'
        });
      }

      const post = await prisma.post.create({
        data: {
          userId: BigInt(userId),
          content: content || 'Untitled Video',
          description: description || '',
          videoUrl,
          thumbnailUrl,
          duration: duration || '0:00',
          views: 0,
          likes: 0,
          dislikes: 0
        }
      });

      const serializedPost = { ...post };
      serializedPost.id = post.id.toString();
      serializedPost.userId = post.userId.toString();

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post: serializedPost
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error.message
      });
    }
  }
}

module.exports = PostController;
