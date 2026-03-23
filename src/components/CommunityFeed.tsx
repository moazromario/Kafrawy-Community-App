import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Plus, 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Filter, 
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Send
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  category: string;
  isVerified?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'أحمد محمود',
    avatar: 'https://picsum.photos/seed/p1/100/100',
    content: 'يا جماعة حد يعرف محل موبايلات كويس في شارع بورسعيد؟ محتاج أصلح شاشة الموبايل ضروري.',
    likes: 24,
    comments: 12,
    time: 'منذ 15 دقيقة',
    category: 'سؤال',
    isVerified: true
  },
  {
    id: '2',
    author: 'سارة علي',
    avatar: 'https://picsum.photos/seed/p2/100/100',
    content: 'منظر الغروب النهاردة من على الكوبري كان تحفة! سبحان الله.',
    image: 'https://picsum.photos/seed/sunset/800/600',
    likes: 156,
    comments: 8,
    time: 'منذ ساعة',
    category: 'عام'
  },
  {
    id: '3',
    author: 'محمود إبراهيم',
    avatar: 'https://picsum.photos/seed/p3/100/100',
    content: 'تنبيه: في أعمال صيانة في خط المياه الرئيسي بكرة الصبح، ياريت الكل يعمل حسابه.',
    likes: 89,
    comments: 45,
    time: 'منذ 3 ساعات',
    category: 'تنبيه',
    isVerified: true
  },
];

const CATEGORIES = ['الكل', 'سؤال', 'تنبيه', 'عام', 'بيع وشراء'];

export default function CommunityFeed({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-royal-900 dark:text-royal-100">مجتمع كفراوي</h1>
          <div className="mr-auto">
            <button className="p-2 bg-royal-50 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 rounded-full">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-4 space-y-4 max-w-md mx-auto">
        
        {/* Create Post Input */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <img src="https://picsum.photos/seed/avatar/100/100" className="w-10 h-10 rounded-full" />
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm text-slate-500">
            بماذا تفكر يا أحمد؟
          </div>
          <button className="p-2 text-royal-600 dark:text-royal-400">
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/4" />
                  </div>
                </div>
                <div className="h-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              </div>
            ))
          ) : (
            posts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{post.author}</h4>
                        {post.isVerified && <CheckCircle2 className="w-3 h-3 text-royal-500 fill-royal-50 dark:fill-royal-900/30" />}
                      </div>
                      <span className="text-[10px] text-slate-400">{post.time}</span>
                    </div>
                  </div>
                  <button className="p-1 text-slate-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="w-full aspect-video">
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Post Footer */}
                <div className="p-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-royal-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-royal-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 left-6 w-14 h-14 rounded-full bg-royal-600 text-white flex items-center justify-center shadow-lg shadow-royal-600/30 z-40"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
