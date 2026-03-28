import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  UserCircle, 
  Smile, 
  MapPin, 
  Send, 
  Heart, 
  MessageCircle, 
  Share2,
  MoreHorizontal,
  Plus,
  X,
  Search,
  Users,
  Bell,
  MessageSquare,
  Play,
  Bookmark,
  UserPlus,
  UserMinus,
  ChevronRight,
  ChevronLeft,
  Camera,
  Film,
  Edit2,
  Trash2,
  Flag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'sonner';
import CommentsSection from '../../components/CommentsSystem';
import { AuthModal } from '../../components/AuthModal';

// --- Types ---
interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: any;
  score?: number;
  user?: User;
  is_edited?: boolean;
  likes?: string[];
}

interface User {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
}

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  type: 'image' | 'video';
  expires_at: any;
  user?: User;
}

interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  actor_id: string;
  entity_id?: string;
  content: string;
  is_read: boolean;
  created_at: any;
  actor?: User;
}

interface Conversation {
  id: string;
  participants: string[];
  last_message?: string;
  last_message_at?: any;
  is_group?: boolean;
  group_id?: string;
  created_at: any;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  is_read: boolean;
  created_at: any;
}

// --- Components ---

const CommunityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'stories' | 'reels' | 'groups' | 'chat' | 'notifications'>('feed');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessageText, setChatMessageText] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [following, setFollowing] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryUser, setActiveStoryUser] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.user_id]) acc[story.user_id] = [];
    acc[story.user_id].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const storyUsers = Object.keys(groupedStories);

  // Auth Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user || null;
      if (u) {
        try {
          // Ensure user profile exists in Supabase
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', u.id)
            .single();
            
          if (userError && userError.code === 'PGRST116') {
            console.log("Creating new user profile for:", u.id);
            const { error: insertUserError } = await supabase.from('users').insert({
              id: u.id,
              name: u.user_metadata.full_name || 'مستخدم كفراوي',
              avatar_url: u.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${u.user_metadata.full_name || 'User'}&background=random`,
              followers_count: 0,
              following_count: 0,
              created_at: new Date().toISOString(),
              role: 'user'
            });
            if (insertUserError) throw insertUserError;
            console.log("User profile created successfully.");
          }
        } catch (err) {
          console.error("Error ensuring user profile exists:", err);
        }
      }
      setUser(u as any);
      setIsAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Follows Listener
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    supabase.from('follows').select('following_id').eq('follower_id', user.id).then(({ data }) => {
      setFollowing(data?.map(d => d.following_id) || []);
    });

    const channel = supabase
      .channel('follows')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows', filter: `follower_id=eq.${user.id}` }, (payload) => {
        // Refetch on change
        supabase.from('follows').select('following_id').eq('follower_id', user.id).then(({ data }) => {
          setFollowing(data?.map(d => d.following_id) || []);
        });
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Data Listeners
  useEffect(() => {
    if (!isAuthReady) return;
    const channels: any[] = [];

    // Posts Listener
    const fetchPosts = async () => {
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        // Calculate Scores for Feed Algorithm
        const scoredPosts = (postsData || []).map(post => {
          const hoursSince = post.created_at ? (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60) : 0;
          const recencyDecay = 1 / (hoursSince + 1);
          const likes = post.likes_count || 0;
          const comments = post.comments_count || 0;
          const shares = post.shares_count || 0;
          const score = (likes * 2) + (comments * 3) + (shares * 5) + (recencyDecay * 10);
          return { ...post, score };
        }).sort((a, b) => (b.score || 0) - (a.score || 0));

        setPosts(scoredPosts as Post[]);
        
        // Fetch missing users
        const userIds = [...new Set((postsData || []).map(p => p.user_id))];
        fetchUsers(userIds);
      } catch (error: any) {
        console.error("Posts fetch error:", error);
        toast.error('حدث خطأ أثناء تحميل المنشورات: ' + error.message);
      }
    };

    fetchPosts();
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        fetchPosts();
      })
      .subscribe();
      
    channels.push(channel);

    // Stories Listener
    const fetchStories = async () => {
      try {
        const now = new Date().toISOString();
        const { data: storiesData, error } = await supabase
          .from('stories')
          .select('*')
          .gt('expires_at', now)
          .order('expires_at', { ascending: true });
        if (error) throw error;
        setStories(storiesData as Story[]);
        fetchUsers((storiesData || []).map(s => s.user_id));
      } catch (error: any) {
        console.error("Stories fetch error:", error);
      }
    };
    
    fetchStories();
    const channelStories = supabase
      .channel('stories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, (payload) => {
        fetchStories();
      })
      .subscribe();
      
    channels.push(channelStories);

    // Notifications Listener
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const { data: notifsData, error } = await supabase
          .from('notifications')
          .select('*, actor:users!notifications_actor_id_fkey(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        setNotifications(notifsData as Notification[]);
      } catch (error: any) {
        console.error("Notifications fetch error:", error);
      }
    };
    
    fetchNotifications();
    const channelNotifs = supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` }, (payload) => {
        fetchNotifications();
      })
      .subscribe();
      
    channels.push(channelNotifs);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [isAuthReady, user]);

  const fetchUsers = async (ids: string[]) => {
    const missingIds = ids.filter(id => !users[id]);
    if (missingIds.length === 0) return;

    const newUsers = { ...users };
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .in('id', missingIds);
    
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    (usersData || []).forEach(user => {
      newUsers[user.id] = user as User;
    });

    missingIds.forEach(id => {
      if (!newUsers[id]) {
        newUsers[id] = { id, name: 'مستخدم كفراوي' } as User;
      }
    });
    setUsers(newUsers);
  };

  const fetchAllUsers = async () => {
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .limit(20);
    
    if (error) {
      console.error("Error fetching all users:", error);
      return;
    }

    const newUsers = { ...users };
    (usersData || []).forEach(user => {
      newUsers[user.id] = user as User;
    });
    setUsers(newUsers);
  };

  useEffect(() => {
    if (isAuthReady) {
      fetchAllUsers();
    }
  }, [isAuthReady]);

  // Chat Effects
  useEffect(() => {
    if (!user || !isAuthReady) return;
    
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .contains('participants', [user.id])
          .order('last_message_at', { ascending: false });
        
        if (error) throw error;
        setConversations(data as Conversation[]);
      } catch (error: any) {
        console.error("Conversations fetch error:", error);
      }
    };
    
    fetchConversations();
    
    const channel = supabase
      .channel('conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `participants=cs.{${user.id}}` }, () => {
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAuthReady]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', activeConversation.id)
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) throw error;
        setMessages(data as Message[]);
      } catch (error: any) {
        console.error("Messages fetch error:", error);
      }
    };
    
    fetchMessages();
    
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversation.id}` }, () => {
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  const startConversation = async (otherUserId: string) => {
    if (!user) return;
    
    try {
      // Check if conversation already exists (1-1)
      const { data: existingConvs, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, otherUserId])
        .eq('is_group', false);
      
      if (convError) throw convError;
      
      let existingConv = existingConvs && existingConvs.length > 0 ? existingConvs[0] : null;
      
      if (existingConv) {
        setActiveConversation(existingConv as Conversation);
        setActiveTab('chat');
      } else {
        // Create new conversation
        const newConv = {
          participants: [user.id, otherUserId],
          is_group: false,
          created_at: new Date().toISOString(),
          last_message_at: new Date().toISOString()
        };
        const { data: newConvData, error: insertError } = await supabase
          .from('conversations')
          .insert(newConv)
          .select()
          .single();
        if (insertError) throw insertError;
        
        setActiveConversation(newConvData as Conversation);
        setActiveTab('chat');
      }
    } catch (error: any) {
      console.error("Start conversation error:", error);
      toast.error('حدث خطأ أثناء بدء المحادثة');
    }
  };

  const handleSendMessage = async () => {
    if (!user || !activeConversation || !chatMessageText.trim()) return;
    
    const text = chatMessageText.trim();
    setChatMessageText('');
    
    try {
      const msg = {
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: text,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      
      const { error: msgError } = await supabase
        .from('messages')
        .insert(msg);
      if (msgError) throw msgError;
      
      // Update conversation last message
      const { error: convError } = await supabase
        .from('conversations')
        .update({
          last_message: text,
          last_message_at: new Date().toISOString()
        })
        .eq('id', activeConversation.id);
      if (convError) throw convError;
    } catch (error: any) {
      console.error("Send message error:", error);
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    }
  };

  const handleCreateStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً لتتمكن من إضافة قصة');
      return;
    }
    if (!file) return;
    
    setLoading(true);
    setUploadProgress(0);
    const toastId = toast.loading('جاري رفع القصة...');
    
    try {
      const sanitizedName = file.name
        .replace(/^[.]+/, '')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
      
      const filePath = `${user.id}/${Date.now()}_${sanitizedName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('stories').insert({
        user_id: user.id,
        media_url: urlData.publicUrl,
        image: urlData.publicUrl, // Added to satisfy NOT NULL constraint on 'image' column
        type: file.type.startsWith('video') ? 'video' : 'image',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      
      if (insertError) throw insertError;
      
      toast.success('تم رفع القصة بنجاح', { id: toastId });
    } catch (error: any) {
      console.error("Story creation error:", error);
      toast.error('حدث خطأ أثناء الرفع: ' + error.message, { id: toastId });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً لتتمكن من النشر');
      return;
    }
    if (!newPostText.trim() && selectedFiles.length === 0) {
      toast.error('يرجى كتابة نص أو اختيار ملف للنشر');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);
    const toastId = toast.loading('جاري نشر المنشور...');

    try {
      const mediaUrls: string[] = [];
      const totalFiles = selectedFiles.length;
      
      if (totalFiles > 0) {
        for (let i = 0; i < totalFiles; i++) {
          const file = selectedFiles[i];
          const sanitizedName = file.name
            .replace(/^[.]+/, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9._-]/g, '');
          
          const filePath = `posts/${user.id}/${Date.now()}_${sanitizedName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);
            
          mediaUrls.push(urlData.publicUrl);
        }
      }

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        content: newPostText,
        media_urls: mediaUrls,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        visibility: 'public',
        created_at: new Date().toISOString()
      });

      if (insertError) throw insertError;

      toast.success('تم النشر بنجاح', { id: toastId });
      setNewPostText('');
      setSelectedFiles([]);
      setIsCreateModalOpen(false);
      setUploadProgress(0);
    } catch (error: any) {
      console.error("Post creation error:", error);
      toast.error('حدث خطأ أثناء النشر: ' + error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('entity_id', postId)
        .eq('entity_type', 'post')
        .maybeSingle();

      if (likeData) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', likeData.id);
        
        await supabase
          .from('posts')
          .update({ 
            likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) - 1,
            likes: (posts.find(p => p.id === postId)?.likes || []).filter(id => id !== user.id)
          })
          .eq('id', postId);
      } else {
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            entity_id: postId,
            entity_type: 'post',
            created_at: new Date().toISOString()
          });
        
        await supabase
          .from('posts')
          .update({ 
            likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + 1,
            likes: [...(posts.find(p => p.id === postId)?.likes || []), user.id]
          })
          .eq('id', postId);
        
        // Trigger Notification
        const { data: postData } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();
          
        if (postData && postData.user_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: postData.user_id,
              type: 'like',
              actor_id: user.id,
              entity_id: postId,
              content: 'أعجب بمنشورك',
              is_read: false,
              created_at: new Date().toISOString()
            });
        }
      }
    } catch (error: any) {
      console.error("Like error:", error);
      toast.error('حدث خطأ أثناء الإعجاب بالمنشور');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    } catch (error: any) {
      console.error("Delete post error:", error);
      toast.error('حدث خطأ أثناء حذف المنشور');
    }
  };

  const handleEditPost = async (postId: string, newContent: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);
      if (error) throw error;
    } catch (error: any) {
      console.error("Edit post error:", error);
      toast.error('حدث خطأ أثناء تعديل المنشور');
    }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!user || user.id === targetUserId) return;
    const isFollowing = following.includes(targetUserId);

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
        
        await supabase.rpc('decrement_user_counts', { user_id: user.id, target_user_id: targetUserId });
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString()
          });
        
        await supabase.rpc('increment_user_counts', { user_id: user.id, target_user_id: targetUserId });

        // Trigger Notification
        await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            type: 'follow',
            actor_id: user.id,
            content: 'بدأ بمتابعتك',
            is_read: false,
            created_at: new Date().toISOString()
          });
      }
    } catch (error: any) {
      console.error("Follow error:", error);
      toast.error('حدث خطأ أثناء المتابعة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter text-primary">كفراوي</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('notifications')} className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="w-6 h-6" />
            {notifications.some(n => !n.is_read) && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
          <button onClick={() => setActiveTab('chat')} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-4 px-4">
        {!user && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-black mb-2">انضم لمجتمع كفراوي</h2>
            <p className="text-sm text-slate-600 mb-4">سجل دخولك الآن لتتمكن من النشر، التعليق، والتفاعل مع جيرانك في كفر الدوار.</p>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              تسجيل الدخول
            </button>
          </div>
        )}

        {/* Stories Section */}
        <section className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-6">
          <label className="flex-shrink-0 w-20 flex flex-col items-center gap-1 cursor-pointer">
            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleCreateStory} />
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white hover:border-primary transition-colors relative overflow-hidden">
              {loading && uploadProgress >= 0 && uploadProgress < 100 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <Plus className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <span className="text-[10px] font-medium">قصتك</span>
          </label>
          {storyUsers.map(uid => (
            <button 
              key={uid} 
              onClick={() => {
                setActiveStoryUser(uid);
                setActiveStoryIndex(0);
                setIsStoryViewerOpen(true);
              }}
              className="flex-shrink-0 w-20 flex flex-col items-center gap-1"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5">
                <img 
                  src={users[uid]?.avatar_url || 'https://picsum.photos/seed/user/100'} 
                  className="w-full h-full rounded-full object-cover"
                  alt="Story"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-medium truncate w-full text-center">
                {users[uid]?.name || 'مستخدم'}
              </span>
            </button>
          ))}
        </section>

        {/* Create Post Trigger */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
          <img 
            src={user?.photoURL || 'https://picsum.photos/seed/me/100'} 
            className="w-10 h-10 rounded-full object-cover"
            alt="Me"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full py-2.5 px-5 text-right text-slate-500 text-sm font-medium"
          >
            بم تفكر يا {user?.displayName?.split(' ')[0] || 'صديقي'}؟
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                setIsCreateModalOpen(true);
                // Optionally set a flag for video only
              }}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Film className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {['feed', 'reels', 'groups'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-bold capitalize transition-colors relative ${
                activeTab === tab ? 'text-primary' : 'text-slate-500'
              }`}
            >
              {tab === 'feed' ? 'الرئيسية' : tab === 'reels' ? 'ريلز' : 'المجموعات'}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Feed */}
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  user={users[post.user_id]} 
                  onLike={() => handleLike(post.id)} 
                  onToggleComments={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  onDelete={() => handleDeletePost(post.id)}
                  onEdit={(content) => handleEditPost(post.id, content)}
                  onMediaClick={(url) => {
                    setSelectedMedia(url);
                    setIsMediaViewerOpen(true);
                  }}
                  showComments={showComments[post.id]}
                  currentUser={user}
                />
              ))}
            </motion.div>
          )}
          {activeTab === 'reels' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-180px)] overflow-y-scroll snap-y snap-mandatory bg-black rounded-3xl"
            >
              {posts.filter(p => p.media_urls?.some(url => url.includes('.mp4') || url.includes('video'))).map(post => (
                <div key={post.id} className="h-full w-full snap-start relative flex items-center justify-center">
                  <video 
                    src={post.media_urls?.[0]} 
                    className="h-full w-full object-contain"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-10 right-4 flex flex-col gap-6 items-center">
                    <button onClick={() => handleLike(post.id)} className="flex flex-col items-center gap-1">
                      <div className={`p-3 rounded-full bg-white/10 backdrop-blur-md ${post.likes_count > 0 ? 'text-rose-500' : 'text-white'}`}>
                        <Heart className="w-7 h-7" />
                      </div>
                      <span className="text-white text-xs font-bold">{post.likes_count}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1">
                      <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white">
                        <MessageCircle className="w-7 h-7" />
                      </div>
                      <span className="text-white text-xs font-bold">{post.comments_count}</span>
                    </button>
                  </div>
                  <div className="absolute bottom-10 left-4 right-16 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={users[post.user_id]?.avatar_url || 'https://picsum.photos/seed/user/100'} 
                        className="w-10 h-10 rounded-full border-2 border-white" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold">@{users[post.user_id]?.name}</span>
                      <button 
                        onClick={() => handleFollow(post.user_id)}
                        className="bg-primary px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        {following.includes(post.user_id) ? 'متابع' : 'متابعة'}
                      </button>
                    </div>
                    <p className="text-sm line-clamp-2">{post.content}</p>
                  </div>
                </div>
              ))}
              {posts.filter(p => p.media_urls?.some(url => url.includes('.mp4') || url.includes('video'))).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/50">
                  <Film className="w-16 h-16 mb-4 opacity-20" />
                  <p>لا توجد فيديوهات قصيرة حالياً</p>
                </div>
              )}
            </motion.div>
          )}
          {activeTab === 'groups' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">اكتشف أشخاصاً جدد</h2>
                <button className="text-primary text-xs font-bold">عرض الكل</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(users).filter(u => u.id !== user?.uid).map(u => (
                  <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center gap-3 shadow-sm">
                    <img src={u.avatar_url || 'https://picsum.photos/seed/user/100'} className="w-16 h-16 rounded-full object-cover" alt={u.name} />
                    <div className="text-center">
                      <h3 className="font-bold text-sm truncate w-full">{u.name}</h3>
                      <p className="text-[10px] text-slate-400">@{u.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => handleFollow(u.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${following.includes(u.id) ? 'bg-slate-100 text-slate-600' : 'bg-primary text-white'}`}
                      >
                        {following.includes(u.id) ? 'متابع' : 'متابعة'}
                      </button>
                      <button 
                        onClick={() => startConversation(u.id)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === 'chat' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-180px)] flex flex-col"
            >
              {!activeConversation ? (
                <>
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold">الرسائل</h2>
                    <button className="p-2 hover:bg-slate-50 rounded-full">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations.map(conv => {
                      const otherId = conv.participants.find(id => id !== user?.uid);
                      const otherUser = otherId ? users[otherId] : null;
                      return (
                        <div 
                          key={conv.id} 
                          onClick={() => setActiveConversation(conv)}
                          className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
                        >
                          <div className="relative">
                            <img 
                              src={otherUser?.avatar_url || 'https://picsum.photos/seed/user/100'} 
                              className="w-12 h-12 rounded-full object-cover" 
                              alt="User" 
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-sm">{otherUser?.name || 'مستخدم'}</h3>
                            <p className="text-xs text-slate-400 truncate">{conv.last_message || 'ابدأ المحادثة الآن'}</p>
                          </div>
                          {conv.last_message_at && (
                            <span className="text-[10px] text-slate-300">
                              {new Date(conv.last_message_at?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {conversations.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">ابدأ بمتابعة الأشخاص للدردشة معهم</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <button onClick={() => setActiveConversation(null)} className="p-1 hover:bg-slate-50 rounded-full">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <img 
                      src={users[activeConversation.participants.find(id => id !== user?.uid) || '']?.avatar_url || 'https://picsum.photos/seed/user/100'} 
                      className="w-10 h-10 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{users[activeConversation.participants.find(id => id !== user?.uid) || '']?.name}</h3>
                      <p className="text-[10px] text-green-500 font-medium">نشط الآن</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                    {messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender_id === user?.uid 
                            ? 'bg-primary text-white self-end rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 self-start rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-100 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={chatMessageText}
                      onChange={(e) => setChatMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب رسالة..."
                      className="flex-1 bg-slate-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {activeTab === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100"
            >
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 flex items-center gap-3 ${!notif.is_read ? 'bg-blue-50/50' : ''}`}>
                  <img 
                    src={users[notif.actor_id]?.avatar_url || 'https://picsum.photos/seed/actor/100'} 
                    className="w-12 h-12 rounded-full object-cover" 
                    alt="Actor" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold">{users[notif.actor_id]?.name}</span> {notif.content}
                    </p>
                    <span className="text-[10px] text-slate-400">{postDate(notif.created_at)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {isStoryViewerOpen && activeStoryUser && groupedStories[activeStoryUser] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4">
              {/* Progress Bars */}
              <div className="flex gap-1 h-1 w-full">
                {groupedStories[activeStoryUser].map((_, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: i < activeStoryIndex ? '100%' : i === activeStoryIndex ? '100%' : '0%' }}
                      transition={{ duration: i === activeStoryIndex ? 5 : 0, ease: 'linear' }}
                      onAnimationComplete={() => {
                        if (i === activeStoryIndex) {
                          if (activeStoryIndex < groupedStories[activeStoryUser].length - 1) {
                            setActiveStoryIndex(prev => prev + 1);
                          } else {
                            setIsStoryViewerOpen(false);
                          }
                        }
                      }}
                      className="h-full bg-white"
                    />
                  </div>
                ))}
              </div>
              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={users[activeStoryUser]?.avatar_url || 'https://picsum.photos/seed/user/100'} 
                    className="w-10 h-10 rounded-full border-2 border-white" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-white font-bold">{users[activeStoryUser]?.name}</span>
                </div>
                <button onClick={() => setIsStoryViewerOpen(false)} className="text-white p-2">
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Story Content */}
            <div className="relative w-full h-full flex items-center justify-center">
              {groupedStories[activeStoryUser][activeStoryIndex].type === 'video' ? (
                <video 
                  src={groupedStories[activeStoryUser][activeStoryIndex].media_url} 
                  className="max-h-full w-full object-contain"
                  autoPlay
                  playsInline
                />
              ) : (
                <img 
                  src={groupedStories[activeStoryUser][activeStoryIndex].media_url} 
                  className="max-h-full w-full object-contain"
                  alt="Story Content"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Navigation Areas */}
              <div className="absolute inset-0 flex">
                <div 
                  className="w-1/3 h-full cursor-pointer" 
                  onClick={() => {
                    if (activeStoryIndex > 0) setActiveStoryIndex(prev => prev - 1);
                  }}
                />
                <div 
                  className="w-2/3 h-full cursor-pointer" 
                  onClick={() => {
                    if (activeStoryIndex < groupedStories[activeStoryUser].length - 1) {
                      setActiveStoryIndex(prev => prev + 1);
                    } else {
                      setIsStoryViewerOpen(false);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {isMediaViewerOpen && selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsMediaViewerOpen(false)}
          >
            <button 
              onClick={() => setIsMediaViewerOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            {selectedMedia.includes('.mp4') || selectedMedia.includes('video') ? (
              <video 
                src={selectedMedia} 
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedMedia} 
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                alt="Full view"
                referrerPolicy="no-referrer"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !loading && setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold">إنشاء منشور</h2>
                <button 
                  onClick={handleCreatePost}
                  disabled={loading || (!newPostText.trim() && selectedFiles.length === 0)}
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50"
                >
                  {loading ? 'جاري النشر...' : 'نشر'}
                </button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={user?.photoURL || 'https://picsum.photos/seed/me/100'} 
                    className="w-10 h-10 rounded-full" 
                    alt="Me" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-sm">{user?.displayName}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                      <Users className="w-3 h-3" />
                      <span>العامة</span>
                    </div>
                  </div>
                </div>
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="ماذا يدور في ذهنك؟"
                  className="w-full text-lg resize-none focus:outline-none min-h-[120px]"
                />
                
                {loading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>جاري الرفع...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                        {file.type.startsWith('video') ? (
                          <video 
                            src={URL.createObjectURL(file)} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {file.type.startsWith('video') && (
                          <div className="absolute bottom-2 left-2 p-1 bg-black/40 backdrop-blur-sm rounded text-[8px] text-white font-bold">
                            VIDEO
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 text-slate-600 hover:text-primary cursor-pointer">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">صور/فيديو</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,video/*"
                      className="hidden" 
                      onChange={(e) => e.target.files && setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])} 
                    />
                  </label>
                  <button className="flex items-center gap-2 text-slate-600 hover:text-primary">
                    <MapPin className="w-6 h-6" />
                    <span className="text-sm font-medium">الموقع</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40">
        <button onClick={() => setActiveTab('feed')} className={`p-2 ${activeTab === 'feed' ? 'text-primary' : 'text-slate-400'}`}>
          <ImageIcon className="w-7 h-7" />
        </button>
        <button onClick={() => setActiveTab('reels')} className={`p-2 ${activeTab === 'reels' ? 'text-primary' : 'text-slate-400'}`}>
          <Film className="w-7 h-7" />
        </button>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/30 -mt-10">
          <Plus className="w-7 h-7" />
        </button>
        <button onClick={() => setActiveTab('groups')} className={`p-2 ${activeTab === 'groups' ? 'text-primary' : 'text-slate-400'}`}>
          <Users className="w-7 h-7" />
        </button>
        <button className="p-2 text-slate-400">
          <UserCircle className="w-7 h-7" />
        </button>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

const renderContent = (text: string) => {
  if (!text) return null;
  const regex = /(@[\w\u0600-\u06FF]+|#[\w\u0600-\u06FF]+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return <span key={i} className="text-primary font-bold hover:underline cursor-pointer">{part}</span>;
    }
    if (part.startsWith('#')) {
      return <span key={i} className="text-emerald-600 font-bold hover:underline cursor-pointer">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const PostCard: React.FC<{ 
  post: Post; 
  user?: User; 
  onLike: () => void; 
  onToggleComments: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
  onMediaClick: (url: string) => void;
  showComments: boolean;
  currentUser: any;
}> = ({ post, user, onLike, onToggleComments, onDelete, onEdit, onMediaClick, showComments, currentUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isOwner = currentUser?.uid === post.user_id;

  const handleEditSubmit = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'منشور من كفراوي',
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar_url || 'https://picsum.photos/seed/user/100'} 
            className="w-10 h-10 rounded-full object-cover" 
            alt="User" 
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold text-sm">{user?.name || 'مستخدم كفراوي'}</h3>
            <div className="flex items-center gap-1">
              <p className="text-[10px] text-slate-400">{postDate(post.created_at)}</p>
              {post.is_edited && <span className="text-[10px] text-slate-400">• معدل</span>}
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showOptions && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-10"
              >
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setShowOptions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> تعديل
                    </button>
                    <button 
                      onClick={() => { onDelete(); setShowOptions(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> حذف
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowOptions(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Flag className="w-4 h-4" /> إبلاغ
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button 
                onClick={handleEditSubmit}
                className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{renderContent(post.content)}</p>
        )}
      </div>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className={`grid gap-0.5 ${post.media_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.media_urls.map((url, i) => {
            const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('video');
            return isVideo ? (
              <div key={i} className="relative w-full aspect-square bg-black flex items-center justify-center cursor-pointer group" onClick={() => onMediaClick(url)}>
                <video src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" playsInline />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                </div>
              </div>
            ) : (
              <img 
                key={i} 
                src={url} 
                referrerPolicy="no-referrer"
                onClick={() => onMediaClick(url)}
                className="w-full aspect-square object-cover cursor-pointer hover:opacity-95 transition-opacity" 
                alt="Post media" 
              />
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center border border-white">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{post.likes_count} إعجاب</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
          <button onClick={onToggleComments}>{post.comments_count} تعليق</button>
          <span>{post.shares_count} مشاركة</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-around">
        <button 
          onClick={onLike}
          className="flex-1 py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span>أعجبني</span>
        </button>
        <button 
          onClick={onToggleComments}
          className="flex-1 py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>تعليق</span>
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 py-2 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>مشاركة</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t border-slate-50">
          <CommentsSection 
            postId={post.id} 
            currentUser={{ 
              id: currentUser?.uid || '', 
              name: currentUser?.displayName || 'User', 
              avatar_url: currentUser?.photoURL || 'https://ui-avatars.com/api/?name=User' 
            }} 
          />
        </div>
      )}
    </motion.div>
  );
};

function postDate(timestamp: any) {
  if (!timestamp) return 'الآن';
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} يوم`;
  if (hours > 0) return `${hours} ساعة`;
  if (minutes > 0) return `${minutes} دقيقة`;
  return 'الآن';
}

export default CommunityModule;
