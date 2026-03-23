/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Menu, 
  Search, 
  Home, 
  Users, 
  Plus, 
  MessageCircle, 
  User,
  ShoppingBag,
  Wrench,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  MapPin,
  ChevronLeft,
  Moon,
  Sun,
  Car
} from 'lucide-react';
import RideBooking from './components/RideBooking';
import KafrawyMarket from './components/KafrawyMarket';
import SanayiyaServices from './components/SanayiyaServices';
import IslamiyatScreen from './components/IslamiyatScreen';
import CommunityFeed from './components/CommunityFeed';
import TeachersScreen from './components/TeachersScreen';
import NotificationsScreen from './components/NotificationsScreen';
import TripHistory from './components/TripHistory';
import DriverRegistration from './components/DriverRegistration';
import AccountModule from './components/AccountModule';

// --- Types ---
interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

interface Offer {
  id: string;
  title: string;
  discount: string;
  image: string;
  store: string;
}

interface NewsItem {
  id: string;
  title: string;
  time: string;
  category: string;
  image: string;
}

// --- Components ---

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'ride' | 'market' | 'sanayiya' | 'islamiyat' | 'community' | 'teachers' | 'notifications' | 'trip-history' | 'driver-reg' | 'account'>('home');
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (currentScreen === 'ride') {
    return <RideBooking onBack={() => setCurrentScreen('home')} onShowHistory={() => setCurrentScreen('trip-history')} />;
  }

  if (currentScreen === 'market') {
    return <KafrawyMarket onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'sanayiya') {
    return <SanayiyaServices onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'islamiyat') {
    return <IslamiyatScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'community') {
    return <CommunityFeed onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'teachers') {
    return <TeachersScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'notifications') {
    return <NotificationsScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'trip-history') {
    return <TripHistory onBack={() => setCurrentScreen('ride')} />;
  }

  if (currentScreen === 'driver-reg') {
    return <DriverRegistration onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'account') {
    return <AccountModule onBack={() => setCurrentScreen('home')} />;
  }

  const SERVICES: Service[] = [
    { id: '1', title: 'كفراوي جو', icon: <MapPin className="w-6 h-6" />, color: 'bg-blue-500', onClick: () => setCurrentScreen('ride') },
    { id: '2', title: 'كفراوي ماركت', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-emerald-500', onClick: () => setCurrentScreen('market') },
    { id: '3', title: 'الصنايعية', icon: <Wrench className="w-6 h-6" />, color: 'bg-amber-500', onClick: () => setCurrentScreen('sanayiya') },
    { id: '4', title: 'المدرسين', icon: <GraduationCap className="w-6 h-6" />, color: 'bg-purple-500', onClick: () => setCurrentScreen('teachers') },
    { id: '5', title: 'المجتمع', icon: <HeartHandshake className="w-6 h-6" />, color: 'bg-rose-500', onClick: () => setCurrentScreen('community') },
    { id: '6', title: 'إسلاميات', icon: <BookOpen className="w-6 h-6" />, color: 'bg-teal-500', onClick: () => setCurrentScreen('islamiyat') },
  ];

  const OFFERS: Offer[] = [
    { id: '1', title: 'وجبة التوفير العائلية', discount: 'خصم 30%', store: 'مطعم المدينة', image: 'https://picsum.photos/seed/food1/300/200' },
    { id: '2', title: 'تشكيلة ملابس صيفية', discount: 'خصم 50%', store: 'أزياء الأناقة', image: 'https://picsum.photos/seed/clothes/300/200' },
    { id: '3', title: 'صيانة تكييف شاملة', discount: '200 جنيه فقط', store: 'المهندس للصيانة', image: 'https://picsum.photos/seed/ac/300/200' },
  ];

  const NEWS: NewsItem[] = [
    { id: '1', title: 'افتتاح الممشى السياحي الجديد نهاية الشهر الجاري', time: 'منذ ساعتين', category: 'أخبار محلية', image: 'https://picsum.photos/seed/news1/150/150' },
    { id: '2', title: 'حملة تبرع بالدم في مستشفى كفر الدوار العام', time: 'منذ 5 ساعات', category: 'صحة ومجتمع', image: 'https://picsum.photos/seed/news2/150/150' },
    { id: '3', title: 'تكريم أوائل الثانوية العامة من أبناء المركز', time: 'منذ يوم', category: 'تعليم', image: 'https://picsum.photos/seed/news3/150/150' },
  ];

  const RADIAL_OPTIONS = [
    { id: 'post', label: 'منشور', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-rose-500', angle: -150 },
    { id: 'product', label: 'منتج', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-emerald-500', angle: -120 },
    { id: 'ride', label: 'رحلة', icon: <MapPin className="w-5 h-5" />, color: 'bg-blue-500', angle: -90 },
    { id: 'service', label: 'خدمة', icon: <Wrench className="w-5 h-5" />, color: 'bg-amber-500', angle: -60 },
    { id: 'teacher', label: 'مدرس', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-purple-500', angle: -30 },
    { id: 'ad', label: 'إعلان', icon: <Bell className="w-5 h-5" />, color: 'bg-teal-500', angle: 0 },
  ];

  return (
    <div className="min-h-screen pb-24 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-l from-royal-900 to-royal-700 text-white shadow-lg rounded-b-3xl">
        <div className="px-4 pt-10 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-gold-400 overflow-hidden bg-white/10 p-1">
                <img 
                  src="https://picsum.photos/seed/avatar/100/100" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-sm text-royal-100">مرحباً بك في</h2>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                  كفراوي
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gold-300"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setCurrentScreen('notifications')}
                className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-royal-800"></span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-royal-300" />
            </div>
            <input 
              type="text" 
              placeholder="عن ماذا تبحث في كفراوي؟" 
              className="w-full bg-white/10 border border-white/20 text-white placeholder-royal-200 rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-8 max-w-md mx-auto">
        
        {/* Services Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-royal-900 dark:text-royal-100">الخدمات الرئيسية</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="w-16 h-4" />
                </div>
              ))
            ) : (
              SERVICES.map((service, index) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={service.onClick}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-16 h-16 rounded-2xl ${service.color} text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow bg-gradient-to-br from-white/20 to-transparent`}>
                    {service.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                    {service.title}
                  </span>
                </motion.button>
              ))
            )}
          </div>
        </section>

          {/* Animated Ad Banner */}
          <section>
            {isLoading ? (
              <Skeleton className="w-full h-32 rounded-2xl" />
            ) : (
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-32 rounded-2xl overflow-hidden shadow-md"
                >
                  <img 
                    src="https://picsum.photos/seed/adbanner/800/300" 
                    alt="Ad Banner" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <h4 className="font-bold text-lg mb-1 text-gold-300">خصم خاص لأهل البلد</h4>
                      <p className="text-sm opacity-90">استخدم كود KAFRAWY24</p>
                    </div>
                  </div>
                </motion.div>

                {/* Driver Registration CTA */}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setCurrentScreen('driver-reg')}
                  className="w-full bg-gradient-to-l from-emerald-600 to-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-white font-black text-sm">كن كابتن في كفراوي</h4>
                      <p className="text-emerald-50 text-[10px] font-bold">حقق أرباحاً إضافية مع كل رحلة</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:translate-x-[-4px] transition-transform">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </motion.button>
              </div>
            )}
          </section>

        {/* Today's Offers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-royal-900 dark:text-royal-100">عروض اليوم</h3>
            <button className="text-sm text-royal-600 dark:text-royal-400 font-medium flex items-center">
              الكل <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x hide-scrollbar">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[240px] snap-center">
                  <Skeleton className="w-full h-32 rounded-t-2xl" />
                  <div className="p-3 border border-t-0 border-slate-100 dark:border-slate-800 rounded-b-2xl">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                </div>
              ))
            ) : (
              OFFERS.map((offer, index) => (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[240px] snap-center bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden"
                >
                  <div className="relative h-32">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm mb-1 line-clamp-1">{offer.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> {offer.store}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Local News */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-royal-900 dark:text-royal-100">أخبار المنطقة</h3>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)]">
                  <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                  <div className="flex-1 py-1">
                    <Skeleton className="w-20 h-3 mb-2" />
                    <Skeleton className="w-full h-4 mb-1" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              ))
            ) : (
              NEWS.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 bg-[var(--card)] p-3 rounded-2xl shadow-sm border border-[var(--border)]"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col justify-between py-1">
                    <span className="text-[10px] font-medium text-royal-600 dark:text-royal-400 bg-royal-50 dark:bg-royal-900/30 px-2 py-0.5 rounded-md w-fit">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm leading-tight line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 mt-1">{item.time}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
        
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-[var(--card)] border-t border-[var(--border)] pb-safe pt-2 px-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50">
        <div className="max-w-md mx-auto flex justify-between items-center relative pb-2">
          
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'home' ? 'text-royal-600 dark:text-royal-400' : 'text-slate-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">الرئيسية</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('community')}
            className={`flex flex-col items-center gap-1 transition-colors ${(currentScreen as string) === 'community' ? 'text-royal-600 dark:text-royal-400' : 'text-slate-400'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">مجتمع</span>
          </button>
          
          {/* Floating Action Button with Radial Menu */}
          <div className="relative -top-6">
            <AnimatePresence>
              {isRadialMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsRadialMenuOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
                  />
                  
                  {/* Radial Options */}
                  {RADIAL_OPTIONS.map((opt, i) => {
                    const radius = 90;
                    const x = Math.cos(opt.angle * (Math.PI / 180)) * radius;
                    const y = Math.sin(opt.angle * (Math.PI / 180)) * radius;
                    
                    return (
                      <motion.div
                        key={opt.id}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{ opacity: 1, x, y, scale: 1 }}
                        exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20, 
                          delay: i * 0.05 
                        }}
                        className="absolute z-50 flex flex-col items-center"
                        style={{ left: '50%', top: '50%', marginLeft: '-20px', marginTop: '-20px' }}
                      >
                        <button className={`w-10 h-10 rounded-full ${opt.color} text-white flex items-center justify-center shadow-lg`}>
                          {opt.icon}
                        </button>
                        <span className="text-[9px] font-bold mt-1 text-white bg-royal-900/80 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                          {opt.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRadialMenuOpen(!isRadialMenuOpen)}
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-royal-700 to-royal-500 text-white flex items-center justify-center shadow-lg shadow-gold-500/30 border-4 border-[var(--background)] relative z-50 transition-transform duration-300 ${isRadialMenuOpen ? 'rotate-45' : ''}`}
            >
              <Plus className="w-7 h-7" />
            </motion.button>
          </div>
          
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-royal-600 dark:hover:text-royal-400 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">رسائل</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('account')}
            className={`flex flex-col items-center gap-1 transition-colors ${(currentScreen as string) === 'account' ? 'text-royal-600 dark:text-royal-400' : 'text-slate-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">حسابي</span>
          </button>
          
        </div>
      </div>

      {/* Global styles for hiding scrollbar but allowing scroll */}
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
