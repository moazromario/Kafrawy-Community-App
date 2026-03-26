import { Request, Response } from 'express';
import { CommentsService } from './comments.service';

export class CommentsController {
  static async createComment(req: Request, res: Response) {
    try {
      const { post_id, parent_id, content, media_url } = req.body;
      const user_id = (req as any).user?.uid; // Assuming auth middleware sets req.user

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      const comment = await CommentsService.createComment({
        post_id,
        user_id,
        parent_id,
        content,
        media_url
      });

      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { sortBy = 'top', page = 1, limit = 20 } = req.query;

      const comments = await CommentsService.getCommentsByPost(
        postId,
        sortBy as 'top' | 'newest',
        Number(page),
        Number(limit)
      );

      res.json(comments);
    } catch (error: any) {
      console.error("Error in getComments controller:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getReplies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const replies = await CommentsService.getReplies(id, Number(page), Number(limit));
      res.json(replies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async editComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      const comment = await CommentsService.editComment(id, user_id, content);
      res.json(comment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      await CommentsService.deleteComment(id, user_id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async likeComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      await CommentsService.likeComment(id, user_id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unlikeComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      await CommentsService.unlikeComment(id, user_id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async pinComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { postId } = req.body;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      const comment = await CommentsService.pinComment(id, postId, user_id);
      res.json(comment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async reportComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const user_id = (req as any).user?.uid;

      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      const result = await CommentsService.reportComment(id, user_id, reason);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
