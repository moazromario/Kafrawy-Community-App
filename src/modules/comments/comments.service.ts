import { supabaseAdmin } from '../../lib/supabase-admin';
import { Filter } from 'bad-words';

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: comment, error } = await supabaseAdmin.from('comments').insert(commentData).select().single();
    if (error) throw error;

    // If it's a reply, increment parent's replies_count
    if (data.parent_id) {
      await supabaseAdmin.rpc('increment_replies_count', { comment_id: data.parent_id });
    }

    // Fetch user details
    const { data: user } = await supabaseAdmin.from('users').select('*').eq('id', data.user_id).single();

    return { ...comment, user: user || { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' } };
  }

  // 2. Get Comments for a Post (Pagination, Nested, Sorting)
  static async getCommentsByPost(postId: string, sortBy: 'top' | 'newest' = 'top', page = 1, limit = 20) {
    let query = supabaseAdmin.from('comments').select('*, user:users(*)').eq('post_id', postId).is('parent_id', null);
    
    if (sortBy === 'top') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: comments, error } = await query;
    if (error) throw error;

    let processedComments = (comments || []).map(c => ({
      ...c,
      user: c.user || { id: c.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' }
    }));

    // Sort pinned to top
    processedComments.sort((a: any, b: any) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return 0;
    });

    // Apply pagination in memory
    const startIndex = (page - 1) * limit;
    return processedComments.slice(startIndex, startIndex + limit);
  }

  // 3. Get Replies for a Comment
  static async getReplies(parentId: string, page = 1, limit = 10) {
    const { data: replies, error } = await supabaseAdmin
      .from('comments')
      .select('*, user:users(*)')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;

    let processedReplies = (replies || []).map(r => ({
      ...r,
      user: r.user || { id: r.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' }
    }));
    
    const startIndex = (page - 1) * limit;
    return processedReplies.slice(startIndex, startIndex + limit);
  }

  // 4. Edit Comment
  static async editComment(id: string, userId: string, newContent: string) {
    const { data: comment, error: fetchError } = await supabaseAdmin.from('comments').select('*').eq('id', id).single();
    if (fetchError || comment.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const isAbusive = filter.isProfane(newContent);

    const { error: updateError } = await supabaseAdmin.from('comments').update({ 
      content: newContent, 
      is_edited: true,
      is_hidden: isAbusive,
      updated_at: new Date().toISOString()
    }).eq('id', id);
    
    if (updateError) throw updateError;

    return { id, content: newContent, is_edited: true, is_hidden: isAbusive };
  }

  // 5. Delete Comment (Soft Delete)
  static async deleteComment(id: string, userId: string) {
    const { data: comment, error: fetchError } = await supabaseAdmin.from('comments').select('*').eq('id', id).single();
    if (fetchError || comment.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { error: updateError } = await supabaseAdmin.from('comments').update({ 
      is_deleted: true, 
      content: 'تم حذف هذا التعليق',
      media_url: null,
      updated_at: new Date().toISOString()
    }).eq('id', id);
    
    if (updateError) throw updateError;

    return { success: true };
  }

  // 6. Like Comment
  static async likeComment(commentId: string, userId: string) {
    const { data: like, error: fetchError } = await supabaseAdmin
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (!like) {
      const { error: insertError } = await supabaseAdmin.from('comment_likes').insert({
        comment_id: commentId,
        user_id: userId,
        created_at: new Date().toISOString()
      });
      if (insertError) throw insertError;
      
      await supabaseAdmin.rpc('increment_likes_count', { comment_id: commentId });
    }
    return { success: true };
  }

  // 7. Unlike Comment
  static async unlikeComment(commentId: string, userId: string) {
    const { data: like, error: fetchError } = await supabaseAdmin
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (like) {
      const { error: deleteError } = await supabaseAdmin
        .from('comment_likes')
        .delete()
        .eq('id', like.id);
      if (deleteError) throw deleteError;
      
      await supabaseAdmin.rpc('decrement_likes_count', { comment_id: commentId });
    }
    return { success: true };
  }

  // 8. Pin Comment
  static async pinComment(id: string, postId: string, userId: string) {
    // Unpin all other comments for this post
    await supabaseAdmin.from('comments').update({ is_pinned: false }).eq('post_id', postId);

    // Pin the selected comment
    const { error } = await supabaseAdmin.from('comments').update({ is_pinned: true }).eq('id', id);
    if (error) throw error;

    return { id, is_pinned: true };
  }

  // 9. Report Comment
  static async reportComment(id: string, userId: string, reason: string) {
    const { error } = await supabaseAdmin.from('comment_reports').insert({
      comment_id: id,
      user_id: userId,
      reason,
      created_at: new Date().toISOString()
    });
    if (error) throw error;
    
    return { success: true, message: 'Report submitted successfully' };
  }
}
