import { db } from '../../config/firebase-admin';
import { Filter } from 'bad-words';
import { FieldValue } from 'firebase-admin/firestore';

const filter = new Filter();
// Add custom Arabic bad words if needed
filter.addWords('كلمة_سيئة', 'شتيمة');

export class CommentsService {
  // 1. Create Comment (with Mentions, Hashtags, Auto-hide)
  static async createComment(data: {
    post_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    media_url?: string;
  }) {
    const isAbusive = filter.isProfane(data.content);
    const mentions = data.content.match(/@[\w\u0600-\u06FF]+/g) || [];
    
    const commentData = {
      post_id: data.post_id,
      user_id: data.user_id,
      parent_id: data.parent_id || null,
      content: data.content,
      media_url: data.media_url || null,
      likes_count: 0,
      replies_count: 0,
      is_edited: false,
      is_deleted: false,
      is_pinned: false,
      is_hidden: isAbusive,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };

    const commentRef = await db.collection('comments').add(commentData);

    // If it's a reply, increment parent's replies_count
    if (data.parent_id) {
      await db.collection('comments').doc(data.parent_id).update({
        replies_count: FieldValue.increment(1)
      });
    }

    // Fetch user details for the response (mocking user details fetch for now, assuming users collection exists)
    let user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
    try {
      const userDoc = await db.collection('users').doc(data.user_id).get();
      if (userDoc.exists) {
        user = { id: userDoc.id, ...userDoc.data() } as any;
      }
    } catch (e) {}

    return { id: commentRef.id, ...commentData, user, created_at: new Date().toISOString() };
  }

  // 2. Get Comments for a Post (Pagination, Nested, Sorting)
  static async getCommentsByPost(postId: string, sortBy: 'top' | 'newest' = 'top', page = 1, limit = 20) {
    const query = db.collection('comments')
      .where('post_id', '==', postId)
      .where('parent_id', '==', null);

    const snapshot = await query.get();
    
    let comments = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      let user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
      try {
        const userDoc = await db.collection('users').doc(data.user_id).get();
        if (userDoc.exists) user = { id: userDoc.id, ...userDoc.data() } as any;
      } catch (e) {}
      
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || new Date().toISOString()),
        user
      };
    }));

    // Sort in memory
    if (sortBy === 'top') {
      comments.sort((a: any, b: any) => (b.likes_count || 0) - (a.likes_count || 0));
    } else {
      comments.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Sort pinned to top
    comments.sort((a: any, b: any) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return 0;
    });

    // Apply pagination in memory
    const startIndex = (page - 1) * limit;
    return comments.slice(startIndex, startIndex + limit);
  }

  // 3. Get Replies for a Comment
  static async getReplies(parentId: string, page = 1, limit = 10) {
    const snapshot = await db.collection('comments')
      .where('parent_id', '==', parentId)
      .get();

    let replies = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      let user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
      try {
        const userDoc = await db.collection('users').doc(data.user_id).get();
        if (userDoc.exists) user = { id: userDoc.id, ...userDoc.data() } as any;
      } catch (e) {}
      
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || new Date().toISOString()),
        user
      };
    }));

    replies.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    const startIndex = (page - 1) * limit;
    return replies.slice(startIndex, startIndex + limit);
  }

  // 4. Edit Comment
  static async editComment(id: string, userId: string, newContent: string) {
    const commentRef = db.collection('comments').doc(id);
    const doc = await commentRef.get();
    
    if (!doc.exists || doc.data()?.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const isAbusive = filter.isProfane(newContent);

    await commentRef.update({ 
      content: newContent, 
      is_edited: true,
      is_hidden: isAbusive,
      updated_at: FieldValue.serverTimestamp()
    });

    return { id, content: newContent, is_edited: true, is_hidden: isAbusive };
  }

  // 5. Delete Comment (Soft Delete)
  static async deleteComment(id: string, userId: string) {
    const commentRef = db.collection('comments').doc(id);
    const doc = await commentRef.get();
    
    if (!doc.exists || doc.data()?.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    await commentRef.update({ 
      is_deleted: true, 
      content: 'تم حذف هذا التعليق',
      media_url: null,
      updated_at: FieldValue.serverTimestamp()
    });

    return { success: true };
  }

  // 6. Like Comment
  static async likeComment(commentId: string, userId: string) {
    const likeRef = db.collection('comment_likes').doc(`${commentId}_${userId}`);
    const likeDoc = await likeRef.get();

    if (!likeDoc.exists) {
      const batch = db.batch();
      batch.set(likeRef, {
        comment_id: commentId,
        user_id: userId,
        created_at: FieldValue.serverTimestamp()
      });
      batch.update(db.collection('comments').doc(commentId), {
        likes_count: FieldValue.increment(1)
      });
      await batch.commit();
    }
    return { success: true };
  }

  // 7. Unlike Comment
  static async unlikeComment(commentId: string, userId: string) {
    const likeRef = db.collection('comment_likes').doc(`${commentId}_${userId}`);
    const likeDoc = await likeRef.get();

    if (likeDoc.exists) {
      const batch = db.batch();
      batch.delete(likeRef);
      batch.update(db.collection('comments').doc(commentId), {
        likes_count: FieldValue.increment(-1)
      });
      await batch.commit();
    }
    return { success: true };
  }

  // 8. Pin Comment
  static async pinComment(id: string, postId: string, userId: string) {
    // Unpin all other comments for this post
    const pinnedSnapshot = await db.collection('comments')
      .where('post_id', '==', postId)
      .where('is_pinned', '==', true)
      .get();

    const batch = db.batch();
    pinnedSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { is_pinned: false });
    });

    // Pin the selected comment
    batch.update(db.collection('comments').doc(id), { is_pinned: true });
    await batch.commit();

    return { id, is_pinned: true };
  }

  // 9. Report Comment
  static async reportComment(id: string, userId: string, reason: string) {
    await db.collection('comment_reports').add({
      comment_id: id,
      user_id: userId,
      reason,
      created_at: FieldValue.serverTimestamp()
    });
    return { success: true, message: 'Report submitted successfully' };
  }
}
