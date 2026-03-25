import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Menu, 
  Image as ImageIcon, 
  Video, 
  Smile, 
  MoreHorizontal, 
  ThumbsUp, 
  Share2, 
  Globe,
  X,
  Send,
  UserCircle,
  MapPin
} from 'lucide-react';

// --- Mock Data ---
const CURRENT_USER = {
  name: 'أحمد محمد',
  avatar: 'https://picsum.photos/seed/user1/100/100'
};

const STORIES = [
  { id: 1, user: 'إضافة قصة', avatar: CURRENT_USER.avatar, image: CURRENT_USER.avatar, isAdd: true },
  { id: 2, user: 'محمود علي', avatar: 'https://picsum.photos/seed/user2/100/100', image: 'https://picsum.photos/seed/story1/200/300' },
  { id: 3, user: 'سارة أحمد', avatar: 'https://picsum.photos/seed/user3/100/100', image: 'https://picsum.photos/seed/story2/200/300' },
  { id: 4, user: 'كريم حسن', avatar: 'https://picsum.photos/seed/user4/100/100', image: 'https://picsum.photos/seed/story3/200/300' },
  { id: 5, user: 'نورهان سعيد', avatar: 'https://picsum.photos/seed/user5/100/100', image: 'https://picsum.photos/seed/story4/200/300' },
];

const INITIAL_POSTS = [
  {
    id: 1,
    user: 'إدارة مدينة الكفراوي',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    time: 'منذ ساعتين',
    content: 'نود إعلامكم بأنه سيتم قطع المياه غداً من الساعة 9 صباحاً وحتى 2 ظهراً لإجراء أعمال صيانة دورية في الخط الرئيسي. نرجو من الجميع تدبير احتياجاتهم.',
    image: 'https://picsum.photos/seed/water/600/400',
    likes: 145,
    comments: 32,
    shares: 12,
    isLiked: false
  },
  {
    id: 2,
    user: 'محمد إبراهيم',
    avatar: 'https://picsum.photos/seed/user6/100/100',
    time: 'منذ 5 ساعات',
    content: 'يا جماعة حد يعرف سباك كويس وشاطر في المجاورة التالتة؟ عندي مشكلة في الحمام ومحتاج حد ضروري.',
    likes: 12,
    comments: 45,
    shares: 0,
    isLiked: true
  },
  {
    id: 3,
    user: 'نادي الكفراوي الرياضي',
    avatar: 'https://picsum.photos/seed/club/100/100',
    time: 'أمس الساعة 8:00 م',
    content: 'صور من تكريم أبطال الكاراتيه في النادي اليوم. فخورين بأبنائنا! 🥇🥋',
    image: 'https://picsum.photos/seed/karate/600/400',
    likes: 340,
    comments: 56,
    shares: 24,
    isLiked: false
  }
];

const CommunityModule = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    
    const newPost = {
      id: Date.now(),
      user: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      time: 'الآن',
      content: newPostText,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter">المجتمع</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <Search className="w-5 h-5 text-slate-900" />
          </button>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <MessageCircle className="w-5 h-5 text-slate-900" />
          </button>
        </div>
      </header>

      {/* Create Post Section */}
      <div className="bg-white mt-2 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img src={CURRENT_USER.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 transition-colors text-right text-slate-500 rounded-full py-2.5 px-4 text-sm font-medium"
          >
            بم تفكر يا {CURRENT_USER.name.split(' ')[0]}؟
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <button className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 py-2 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold text-slate-600">بث مباشر</span>
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 py-2 rounded-lg transition-colors">
            <ImageIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold text-slate-600">صورة/فيديو</span>
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button className="flex items-center justify-center gap-2 flex-1 hover:bg-slate-50 py-2 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-600">شعور/نشاط</span>
          </button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="bg-white mt-2 p-4 shadow-sm overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar snap-x">
          {STORIES.map(story => (
            <div key={story.id} className="relative w-28 h-44 flex-shrink-0 rounded-xl overflow-hidden snap-start cursor-pointer group">
              <img 
                src={story.image} 
                alt={story.user} 
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${story.isAdd ? 'brightness-75' : ''}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {story.isAdd ? (
                <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white mb-1">
                    <span className="text-white text-lg font-bold leading-none">+</span>
                  </div>
                  <span className="text-white text-xs font-bold text-center">إنشاء قصة</span>
                </div>
              ) : (
                <>
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden">
                    <img src={story.avatar} alt={story.user} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-3 right-3 text-white text-xs font-bold drop-shadow-md">
                    {story.user}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="mt-2 space-y-2">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-sm">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{post.user}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <span>{post.time}</span>
                    <span>•</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="w-full max-h-[400px] overflow-hidden bg-slate-100">
                <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Post Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-slate-500 text-xs border-b border-slate-100">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center border border-white z-10">
                  <ThumbsUp className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="mr-1">{post.likes}</span>
              </div>
              <div className="flex gap-3">
                <span>{post.comments} تعليقاً</span>
                <span>{post.shares} مشاركة</span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-2 py-1 flex items-center justify-between">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-50 transition-colors ${post.isLiked ? 'text-blue-600' : 'text-slate-600'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-bold">أعجبني</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-bold">تعليق</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-bold">مشاركة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-black text-slate-900">إنشاء منشور</h2>
              <button 
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors ${newPostText.trim() ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                نشر
              </button>
            </div>
            
            <div className="p-4 flex items-center gap-3">
              <img src={CURRENT_USER.avatar} alt="User" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
              <div>
                <h3 className="font-bold text-slate-900">{CURRENT_USER.name}</h3>
                <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold mt-1 w-fit">
                  <Globe className="w-3 h-3" />
                  <span>العامة</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <textarea
                autoFocus
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={`بم تفكر يا ${CURRENT_USER.name.split(' ')[0]}؟`}
                className="w-full h-full resize-none text-xl outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center justify-between border border-slate-300 rounded-xl p-3 shadow-sm">
                <span className="font-bold text-slate-700 text-sm">إضافة إلى منشورك</span>
                <div className="flex items-center gap-3">
                  <button className="text-green-500 hover:bg-green-50 p-1.5 rounded-full transition-colors"><ImageIcon className="w-6 h-6" /></button>
                  <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors"><UserCircle className="w-6 h-6" /></button>
                  <button className="text-amber-500 hover:bg-amber-50 p-1.5 rounded-full transition-colors"><Smile className="w-6 h-6" /></button>
                  <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"><MapPin className="w-6 h-6" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityModule;
