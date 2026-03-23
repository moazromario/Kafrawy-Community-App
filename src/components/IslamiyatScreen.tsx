import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Book, 
  Compass, 
  Radio, 
  Moon, 
  Sun, 
  Clock,
  ChevronLeft,
  Heart
} from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

const PRAYER_TIMES: PrayerTime[] = [
  { name: 'الفجر', time: '04:22' },
  { name: 'الشروق', time: '05:51' },
  { name: 'الظهر', time: '12:05' },
  { name: 'العصر', time: '15:38' },
  { name: 'المغرب', time: '18:19', isNext: true },
  { name: 'العشاء', time: '19:38' },
];

export default function IslamiyatScreen({ onBack }: { onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState('02:14:45');
  const [isMaghribPassed, setIsMaghribPassed] = useState(false);

  useEffect(() => {
    // Simulate countdown
    const timer = setInterval(() => {
      // Logic for countdown would go here
    }, 1000);
    
    // Simulate "Automatic dark mode after Maghrib"
    const now = new Date();
    if (now.getHours() >= 18) {
      setIsMaghribPassed(true);
      document.documentElement.classList.add('dark');
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isMaghribPassed ? 'bg-slate-950' : 'bg-teal-50'}`}>
      {/* Calm Gradient Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-teal-900/10 dark:to-indigo-950/40 pointer-events-none" />

      <header className="relative z-10 p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md">
          <ArrowRight className="w-6 h-6 text-teal-800 dark:text-teal-200" />
        </button>
        <h1 className="text-xl font-bold text-teal-900 dark:text-teal-100">إسلاميات</h1>
        <div className="w-10" />
      </header>

      <main className="relative z-10 px-6 pt-4 space-y-8 max-w-md mx-auto">
        
        {/* Next Prayer Countdown */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <p className="text-teal-600 dark:text-teal-400 font-medium">الصلاة القادمة: المغرب</p>
          <h2 className="text-5xl font-bold text-teal-900 dark:text-white font-mono tracking-widest">
            {timeLeft}
          </h2>
          <p className="text-sm text-teal-500/70 dark:text-teal-400/50">متبقي على رفع الأذان</p>
        </motion.section>

        {/* Prayer Times Card */}
        <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/40 dark:border-slate-800/40">
          <div className="grid grid-cols-3 gap-y-6">
            {PRAYER_TIMES.map((prayer, index) => (
              <div key={prayer.name} className={`flex flex-col items-center gap-1 ${prayer.isNext ? 'scale-110' : 'opacity-60'}`}>
                <span className={`text-xs font-bold ${prayer.isNext ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}`}>
                  {prayer.name}
                </span>
                <span className={`text-lg font-bold ${prayer.isNext ? 'text-teal-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {prayer.time}
                </span>
                {prayer.isNext && (
                  <motion.div 
                    layoutId="nextIndicator"
                    className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { title: 'القرآن الكريم', icon: <Book className="w-8 h-8" />, color: 'bg-emerald-500' },
            { title: 'الأذكار', icon: <Heart className="w-8 h-8" />, color: 'bg-rose-500' },
            { title: 'اتجاه القبلة', icon: <Compass className="w-8 h-8" />, color: 'bg-amber-500' },
            { title: 'إذاعة القرآن', icon: <Radio className="w-8 h-8" />, color: 'bg-blue-500' },
          ].map((item, index) => (
            <motion.button
              key={item.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-700/20 flex flex-col items-center gap-3 shadow-sm"
            >
              <div className={`p-3 rounded-2xl ${item.color} text-white shadow-lg shadow-black/5`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold text-teal-900 dark:text-teal-100">{item.title}</span>
            </motion.button>
          ))}
        </section>

        {/* Daily Verse */}
        <section className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <p className="text-lg font-serif italic mb-4 leading-relaxed">
            "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ"
          </p>
          <span className="text-xs opacity-70">سورة البقرة - آية 186</span>
        </section>

      </main>
    </div>
  );
}
