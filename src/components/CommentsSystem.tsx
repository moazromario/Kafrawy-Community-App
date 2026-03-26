import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore';
// import { Filter } from 'bad-words';
// const filter = new Filter();
// filter.addWords('كلمة_سيئة', 'شتيمة');

import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Smile, 
  Send, 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  X,
  Clock,
  Pin,
  Flag,
  ShieldAlert
} from 'lucide-react';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export interface User {
  id: string;
  name: string;
  avatar_url: string;
}

export interface CommentType {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  media_url?: string;
  likes_count: number;
  replies_count: number;
  is_edited: boolean;
  is_deleted: boolean;
  is_pinned?: boolean;
  is_hidden?: boolean;
  created_at: string;
  user: User;
  isLikedByMe?: boolean;
}

// ==========================================
// 2. Loading Skeleton Component
// ==========================================
export const CommentSkeleton = () => (
  <div className="flex gap-3 w-full animate-pulse mb-4">
    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      <div className="flex gap-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-10" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-10" />
      </div>
    </div>
  </div>
);

// ==========================================
// 3. Helper: Render Mentions & Hashtags
// ==========================================
const renderContent = (text: string) => {
  // Regex to match @mentions and #hashtags (Arabic and English)
  const regex = /(@[\w\u0600-\u06FF]+|#[\w\u0600-\u06FF]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return <span key={i} className="text-royal-600 dark:text-royal-400 font-bold hover:underline cursor-pointer">{part}</span>;
    }
    if (part.startsWith('#')) {
      return <span key={i} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

// ==========================================
// 4. Comment Input Box (Add/Edit/Reply)
// ==========================================
interface CommentInputProps {
  onSubmit: (content: string, media?: File) => Promise<void>;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  currentUser: User;
}

export const CommentInput: React.FC<CommentInputProps> = ({ 
  onSubmit, 
  placeholder = "اكتب تعليقاً...", 
  initialValue = "", 
  autoFocus = false,
  onCancel,
  currentUser
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async () => {
    if (!content.trim() && !isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to submit comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <img 
        src={currentUser.avatar_url} 
        alt={currentUser.name} 
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100 dark:border-slate-800"
      />
      <div className="flex-1 relative">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-royal-500 transition-all">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // Auto-resize
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder={placeholder}
            className="w-full bg-transparent p-3 outline-none resize-none min-h-[44px] max-h-[150px] text-sm dark:text-white"
            rows={1}
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 text-slate-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 rounded-full transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-400 hover:text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {onCancel && (
                <button 
                  onClick={onCancel}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5"
                >
                  إلغاء
                </button>
              )}
              <button 
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="p-2 bg-royal-600 text-white rounded-full hover:bg-royal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Fake Emoji Picker Dropdown */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-10 flex gap-2 text-2xl"
            >
              {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => setContent(prev => prev + emoji)}
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 5. Single Comment Item
// ==========================================
interface CommentItemProps {
  comment: CommentType;
  currentUser: User;
  onLike: (id: string, isLiked: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => Promise<void>;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
  onPin?: (id: string) => void;
  onReport?: (id: string) => void;
  fetchReplies: (parentId: string) => Promise<CommentType[]>;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onLike,
  onDelete,
  onEdit,
  onReplySubmit,
  onPin,
  onReport,
  fetchReplies,
  depth = 0
}) => {
  const [isLiked, setIsLiked] = useState(comment.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Hidden/Abusive state
  const [showHidden, setShowHidden] = useState(false);

  // Replies State
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const isOwner = currentUser.id === comment.user_id;
  const isDeleted = comment.is_deleted;
  const isHidden = comment.is_hidden && !showHidden;

  const handleLike = () => {
    if (isDeleted) return;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(comment.id, newLikedState);
  };

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0 && comment.replies_count > 0) {
      setIsLoadingReplies(true);
      try {
        const fetchedReplies = await fetchReplies(comment.id);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error("Failed to fetch replies", error);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (content: string) => {
    await onReplySubmit(comment.id, content);
    setIsReplying(false);
    // Optimistically show replies if they were hidden
    if (!showReplies) setShowReplies(true);
  };

  const handleEditSubmit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  // Format time (Mock function for demo)
  const timeAgo = "منذ ساعتين"; 

  if (isEditing) {
    return (
      <div className="mb-4">
        <CommentInput 
          currentUser={currentUser}
          initialValue={comment.content}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          autoFocus
        />
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 w-full mb-4 ${depth > 0 ? 'mt-3' : ''}`}
    >
      {/* Avatar */}
      <img 
        src={isDeleted ? 'https://ui-avatars.com/api/?name=Deleted&background=random' : comment.user.avatar_url} 
        alt={comment.user.name} 
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100 dark:border-slate-800"
      />

      <div className="flex-1 min-w-0">
        {/* Pinned Badge */}
        {comment.is_pinned && depth === 0 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
            <Pin className="w-3 h-3 fill-current" /> تعليق مثبت
          </div>
        )}

        {/* Comment Bubble */}
        <div className="group relative inline-block max-w-full">
          <div className={`px-4 py-2.5 rounded-2xl ${isDeleted ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 italic border border-slate-200 dark:border-slate-700' : isHidden ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="font-bold text-sm">
                {isDeleted ? 'مستخدم محذوف' : comment.user.name}
              </span>
            </div>
            
            {isHidden ? (
              <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col items-start gap-2 py-1">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  تم إخفاء هذا التعليق لاحتمالية احتوائه على محتوى مسيء.
                </div>
                <button 
                  onClick={() => setShowHidden(true)}
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline"
                >
                  عرض على أي حال
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {isDeleted ? comment.content : renderContent(comment.content)}
                </p>
                {comment.media_url && !isDeleted && (
                  <img src={comment.media_url} alt="Comment attachment" className="mt-2 rounded-xl max-h-60 object-cover" />
                )}
              </>
            )}
          </div>

          {/* Options Menu (Edit/Delete/Pin/Report) */}
          {!isDeleted && !isHidden && (
            <div className="absolute top-2 -left-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showOptions && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden z-10"
                    >
                      {isOwner ? (
                        <>
                          {depth === 0 && onPin && (
                            <button 
                              onClick={() => { onPin(comment.id); setShowOptions(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Pin className="w-4 h-4" /> {comment.is_pinned ? 'إلغاء التثبيت' : 'تثبيت'}
                            </button>
                          )}
                          <button 
                            onClick={() => { setIsEditing(true); setShowOptions(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" /> تعديل
                          </button>
                          <button 
                            onClick={() => { onDelete(comment.id); setShowOptions(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> حذف
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => { onReport && onReport(comment.id); setShowOptions(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Flag className="w-4 h-4" /> إبلاغ
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        {!isDeleted && !isHidden && (
          <div className="flex items-center gap-4 mt-1.5 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{timeAgo}</span>
            
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-royal-600 transition-colors ${isLiked ? 'text-royal-600' : ''}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && <span>{likesCount}</span>}
              <span className="hidden sm:inline">إعجاب</span>
            </button>

            {depth === 0 && ( // Only allow 1 level of nesting visually
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">رد</span>
              </button>
            )}

            {comment.is_edited && (
              <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                <Edit2 className="w-3 h-3" /> معدل
              </span>
            )}
          </div>
        )}

        {/* Reply Input */}
        <AnimatePresence>
          {isReplying && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <CommentInput 
                currentUser={currentUser}
                placeholder={`رد على ${comment.user.name}...`}
                onSubmit={handleReplySubmit}
                onCancel={() => setIsReplying(false)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies Section */}
        {comment.replies_count > 0 && depth === 0 && (
          <div className="mt-2">
            <button 
              onClick={handleToggleReplies}
              className="flex items-center gap-2 text-sm font-bold text-royal-600 hover:text-royal-700 transition-colors py-1"
            >
              {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showReplies ? 'إخفاء الردود' : `عرض ${comment.replies_count} ردود`}
            </button>

            <AnimatePresence>
              {showReplies && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative pl-2 pr-4 mt-3 border-r-2 border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  {isLoadingReplies ? (
                    <div className="space-y-3">
                      <CommentSkeleton />
                      <CommentSkeleton />
                    </div>
                  ) : (
                    replies.map(reply => (
                      <CommentItem 
                        key={reply.id}
                        comment={reply}
                        currentUser={currentUser}
                        onLike={onLike}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onReplySubmit={onReplySubmit}
                        onReport={onReport}
                        fetchReplies={fetchReplies}
                        depth={depth + 1}
                      />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==========================================
// 6. Main Comments Section Container
// ==========================================
interface CommentsSectionProps {
  postId: string;
  currentUser: User;
}

export default function CommentsSection({ postId, currentUser }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

  // Fetching Data & Realtime Subscription
  useEffect(() => {
    setIsLoading(true);
    
    let unsubscribe: () => void;
    
    const init = async () => {
      const { db } = await import('../firebase');
      // Realtime Subscription with Firestore
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('post_id', '==', postId), where('parent_id', '==', null));
      
      unsubscribe = onSnapshot(q, async (snapshot) => {
        const newComments: CommentType[] = [];
        const userCache: Record<string, any> = {};
        
        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data();
          let user = userCache[data.user_id];
          
          if (!user) {
            try {
              const userDoc = await getDoc(doc(db, 'users', data.user_id));
              if (userDoc.exists()) {
                user = { id: userDoc.id, ...userDoc.data() };
                userCache[data.user_id] = user;
              } else {
                user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
              }
            } catch (e) {
              user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
            }
          }
          
          newComments.push({
            id: docSnapshot.id,
            ...data,
            created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || new Date().toISOString()),
            user
          } as CommentType);
        }
        
        setComments(newComments);
        setIsLoading(false);
      }, (error) => {
        console.error("Error in comments snapshot:", error);
        setIsLoading(false);
      });
    };
    
    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [postId]);

  // Sort comments: Pinned always first, then by selected sort
  const sortedComments = [...comments].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    if (sortBy === 'top') {
      return b.likes_count - a.likes_count;
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Handlers
  const handleAddComment = async (content: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    
    try {
      const { addDoc, serverTimestamp } = await import('firebase/firestore');
      const commentsRef = collection(db, 'comments');
      
      await addDoc(commentsRef, {
        post_id: postId,
        user_id: currentUser.id,
        parent_id: null,
        content,
        likes_count: 0,
        replies_count: 0,
        is_edited: false,
        is_deleted: false,
        is_pinned: false,
        is_hidden: false, // filter.isProfane(content),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReplySubmit = async (parentId: string, content: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    
    try {
      const { addDoc, serverTimestamp, updateDoc, increment } = await import('firebase/firestore');
      const commentsRef = collection(db, 'comments');
      
      await addDoc(commentsRef, {
        post_id: postId,
        user_id: currentUser.id,
        parent_id: parentId,
        content,
        likes_count: 0,
        replies_count: 0,
        is_edited: false,
        is_deleted: false,
        is_pinned: false,
        is_hidden: false, // filter.isProfane(content),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      // Update parent replies count
      const parentRef = doc(db, 'comments', parentId);
      await updateDoc(parentRef, {
        replies_count: increment(1)
      });
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleEdit = async (id: string, newContent: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    try {
      const { updateDoc, serverTimestamp } = await import('firebase/firestore');
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        content: newContent,
        is_edited: true,
        is_hidden: false, // filter.isProfane(newContent),
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    try {
      const { updateDoc, serverTimestamp } = await import('firebase/firestore');
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        is_deleted: true,
        content: 'تم حذف هذا التعليق',
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLike = async (id: string, isLiked: boolean) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    try {
      const { setDoc, deleteDoc, updateDoc, increment, serverTimestamp } = await import('firebase/firestore');
      const likeRef = doc(db, 'comment_likes', `${id}_${currentUser.id}`);
      const commentRef = doc(db, 'comments', id);
      
      if (isLiked) {
        await setDoc(likeRef, {
          comment_id: id,
          user_id: currentUser.id,
          created_at: serverTimestamp()
        });
        await updateDoc(commentRef, { likes_count: increment(1) });
      } else {
        await deleteDoc(likeRef);
        await updateDoc(commentRef, { likes_count: increment(-1) });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePin = async (id: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    try {
      const { updateDoc, getDocs, query, where, collection } = await import('firebase/firestore');
      
      // Unpin currently pinned comment if any
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('post_id', '==', postId), where('is_pinned', '==', true));
      const snapshot = await getDocs(q);
      
      for (const d of snapshot.docs) {
        if (d.id !== id) {
          await updateDoc(doc(db, 'comments', d.id), { is_pinned: false });
        }
      }
      
      // Toggle pin for this comment
      const commentToPin = comments.find(c => c.id === id);
      if (commentToPin) {
        await updateDoc(doc(db, 'comments', id), { is_pinned: !commentToPin.is_pinned });
      }
    } catch (error) {
      console.error("Error pinning comment:", error);
    }
  };

  const handleReport = async (id: string) => {
    const { auth, db } = await import('../firebase');
    if (!auth.currentUser) return;
    try {
      const { addDoc, serverTimestamp, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'comment_reports'), {
        comment_id: id,
        user_id: currentUser.id,
        reason: 'Inappropriate content',
        created_at: serverTimestamp()
      });
      alert('تم الإبلاغ عن التعليق بنجاح. سيقوم فريق الإشراف بمراجعته.');
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const fetchReplies = async (parentId: string): Promise<CommentType[]> => {
    const { db } = await import('../firebase');
    try {
      const { getDocs } = await import('firebase/firestore');
      const repliesRef = collection(db, 'comments');
      const q = query(repliesRef, where('parent_id', '==', parentId));
      const snapshot = await getDocs(q);
      
      const replies: CommentType[] = [];
      const userCache: Record<string, any> = {};
      
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        let user = userCache[data.user_id];
        
        if (!user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', data.user_id));
            if (userDoc.exists()) {
              user = { id: userDoc.id, ...userDoc.data() };
              userCache[data.user_id] = user;
            } else {
              user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
            }
          } catch (e) {
            user = { id: data.user_id, name: 'User', avatar_url: 'https://ui-avatars.com/api/?name=User' };
          }
        }
        
        replies.push({
          id: docSnapshot.id,
          ...data,
          created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || new Date().toISOString()),
          user
        } as CommentType);
      }
      
      return replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } catch (error) {
      console.error("Error fetching replies:", error);
      return [];
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      {/* Header & Sorting */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          التعليقات <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-0.5 px-2 rounded-full text-sm">24</span>
        </h2>
        
        <div className="flex items-center gap-2 text-sm font-medium bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setSortBy('top')}
            className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'top' ? 'bg-white dark:bg-slate-800 shadow-sm text-royal-600 dark:text-royal-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            الأبرز
          </button>
          <button 
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'newest' ? 'bg-white dark:bg-slate-800 shadow-sm text-royal-600 dark:text-royal-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            الأحدث
          </button>
        </div>
      </div>

      {/* Main Input */}
      <div className="mb-8">
        <CommentInput 
          currentUser={currentUser}
          onSubmit={handleAddComment}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {isLoading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : sortedComments.length > 0 ? (
          <AnimatePresence>
            {sortedComments.map(comment => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onLike={handleLike}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReplySubmit={handleReplySubmit}
                onPin={handlePin}
                onReport={handleReport}
                fetchReplies={fetchReplies}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
          </div>
        )}
      </div>
    </div>
  );
}
