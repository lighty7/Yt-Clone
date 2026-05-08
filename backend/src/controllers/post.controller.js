const { prisma } = require('../config/prisma');

class PostController {
  /**
   * Get all posts with user information
   */
  static async getAllPosts(req, res) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Convert BigInt to string for JSON serialization
      const serializedPosts = posts.map(post => {
        const serializedPost = { ...post };
        serializedPost.id = post.id.toString();
        serializedPost.userId = post.userId.toString();
        if (serializedPost.user) {
          serializedPost.user.id = post.user.id.toString();
        }
        return serializedPost;
      });

      res.json({
        success: true,
        posts: serializedPosts
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
   * Get post by ID
   */
  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: { id: BigInt(id) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
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

      // Serialize BigInt
      const serializedPost = { ...post };
      serializedPost.id = post.id.toString();
      serializedPost.userId = post.userId.toString();
      if (serializedPost.user) {
        serializedPost.user.id = post.user.id.toString();
      }
      serializedPost.comments = post.comments.map(comment => ({
        ...comment,
        id: comment.id.toString(),
        postId: comment.postId.toString(),
        userId: comment.userId.toString(),
        user: {
          ...comment.user,
          id: comment.user.id.toString()
        }
      }));

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
      const userId = req.user.id; // Assumes auth middleware sets req.user

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
