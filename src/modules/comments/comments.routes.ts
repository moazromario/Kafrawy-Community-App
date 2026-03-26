import { Router } from 'express';
import { CommentsController } from './comments.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate Limiter to prevent spam (max 5 comments per minute)
const commentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: 'لقد تجاوزت الحد المسموح به للتعليقات. يرجى المحاولة بعد قليل.' }
});

// Mock Auth Middleware for Demo (Replace with actual auth middleware)
const authMiddleware = (req: any, res: any, next: any) => {
  req.user = { uid: 'user1' }; // Mock user
  next();
};

router.use(authMiddleware);

router.post('/create', commentRateLimiter, CommentsController.createComment);
router.get('/post/:postId', CommentsController.getComments);
router.get('/:id/replies', CommentsController.getReplies);
router.put('/edit/:id', CommentsController.editComment);
router.delete('/:id', CommentsController.deleteComment);

router.post('/:id/like', CommentsController.likeComment);
router.delete('/:id/unlike', CommentsController.unlikeComment);

router.post('/:id/pin', CommentsController.pinComment);
router.post('/:id/report', CommentsController.reportComment);

export default router;
