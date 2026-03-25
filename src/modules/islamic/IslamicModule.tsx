import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Moon, 
  Book, 
  Scroll, 
  History, 
  Sparkles, 
  ArrowRight, 
  PlayCircle,
  Search
} from 'lucide-react';

// --- Mock Data ---
const SURAHS = [
  { id: 1, name: 'الفاتحة', verses: 7, type: 'مكية' },
  { id: 2, name: 'البقرة', verses: 286, type: 'مدنية' },
  { id: 3, name: 'آل عمران', verses: 200, type: 'مدنية' },
  { id: 18, name: 'الكهف', verses: 110, type: 'مكية' },
  { id: 36, name: 'يس', verses: 83, type: 'مكية' },
  { id: 55, name: 'الرحمن', verses: 78, type: 'مدنية' },
  { id: 67, name: 'الملك', verses: 30, type: 'مكية' },
];

const AZKAR_CATEGORIES = [
  { id: 'morning', title: 'أذكار الصباح', count: 24 },
  { id: 'evening', title: 'أذكار المساء', count: 24 },
  { id: 'sleep', title: 'أذكار النوم', count: 12 },
  { id: 'prayer', title: 'أذكار الصلاة', count: 8 },
];

const ARTICLES = [
  { id: 1, title: 'فضل صلاة الفجر في جماعة', author: 'د. أحمد الطيب', readTime: '5 دقائق', image: 'https://picsum.photos/seed/islamic1/400/300' },
  { id: 2, title: 'غزوة بدر: دروس وعبر', author: 'الشيخ محمد الغزالي', readTime: '10 دقائق', image: 'https://picsum.photos/seed/islamic2/400/300' },
  { id: 3, title: 'أهمية الزكاة في بناء المجتمع', author: 'د. علي جمعة', readTime: '7 دقائق', image: 'https://picsum.photos/seed/islamic3/400/300' },
];

// --- Sub-screens ---

const QuranScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">القرآن الكريم</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن سورة..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-3">
          {SURAHS.filter(s => s.name.includes(search)).map(surah => (
            <motion.div 
              key={surah.id}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between soft-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm">
                  {surah.id}
                </div>
                <div>
                  <h3 className="font-black text-lg">سورة {surah.name}</h3>
                  <p className="text-xs text-[var(--muted)] font-bold">{surah.type} • {surah.verses} آية</p>
                </div>
              </div>
              <PlayCircle className="w-6 h-6 text-emerald-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AzkarScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">الأذكار</h1>
      </header>

      <div className="p-5 grid grid-cols-2 gap-4">
        {AZKAR_CATEGORIES.map(cat => (
          <motion.div 
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--card)] p-5 rounded-3xl border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-sm mb-1">{cat.title}</h3>
              <p className="text-xs text-[var(--muted)] font-bold">{cat.count} ذكر</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ArticlesScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">مقالات إسلامية</h1>
      </header>

      <div className="p-5 space-y-4">
        {ARTICLES.map(article => (
          <motion.div 
            key={article.id}
            whileTap={{ scale: 0.98 }}
            className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow cursor-pointer"
          >
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-black text-lg mb-2">{article.title}</h3>
              <div className="flex justify-between items-center text-xs text-[var(--muted)] font-bold">
                <span>{article.author}</span>
                <span>{article.readTime} قراءة</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const IslamicDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">إسلاميات</h1>
      </header>

      {/* Daily Inspiration */}
      <div className="p-5">
        <div className="bg-emerald-600 text-white rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-emerald-600/20">
          <Moon className="absolute -left-4 -top-4 w-32 h-32 text-white opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-90">
              <Book className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">آية اليوم</span>
            </div>
            <p className="text-xl font-bold leading-relaxed mb-4 font-serif text-center">
              "إِنَّ مَعَ الْعُسْرِ يُسْرًا"
            </p>
            <p className="text-sm opacity-80 text-center">سورة الشرح - الآية 6</p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-5 grid grid-cols-2 gap-4">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/quran')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Book className="w-8 h-8" />
          </div>
          <span className="font-black">القرآن الكريم</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/hadith')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Scroll className="w-8 h-8" />
          </div>
          <span className="font-black">الأحاديث</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/azkar')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="font-black">الأذكار</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/articles')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <History className="w-8 h-8" />
          </div>
          <span className="font-black">مقالات</span>
        </motion.div>
      </div>
    </div>
  );
};

const IslamicModule = () => {
  return (
    <Routes>
      <Route path="/" element={<IslamicDashboard />} />
      <Route path="/quran" element={<QuranScreen />} />
      <Route path="/hadith" element={<div className="p-8 text-center"><h2 className="text-2xl font-black mb-4">الأحاديث النبوية</h2><p className="text-[var(--muted)]">قريباً...</p></div>} />
      <Route path="/azkar" element={<AzkarScreen />} />
      <Route path="/articles" element={<ArticlesScreen />} />
    </Routes>
  );
};

export default IslamicModule;
