import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight,
  ChevronLeft,
  User,
  CheckCircle2,
  GraduationCap,
  DollarSign,
  Award,
  MessageSquare,
  Video,
  MapPin,
  Navigation,
  Plus,
  X,
  Camera,
  Info,
  Wallet,
  Zap,
  Phone,
  MoreVertical,
  Send,
  ChevronRight,
  Book,
  Users,
  TrendingUp,
  LayoutDashboard,
  Bell,
  Tag,
  Droplets,
  History as HistoryIcon,
  ImagePlus
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  image: string;
  isVerified: boolean;
  experience: string;
  description: string;
  education: string;
  location: string;
  languages: string[];
  schedule: { day: string; times: string[] }[];
  about: string;
  stats: {
    students: number;
    hours: number;
    courses: number;
  };
  gallery?: string[];
  projects?: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
  reviewsList?: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    avatar: string;
  }[];
}

interface Chat {
  id: string;
  participantName: string;
  participantImage: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

const SUBJECTS = [
  { id: 'all', name: 'الكل', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'math', name: 'رياضيات', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'arabic', name: 'لغة عربية', icon: <Book className="w-4 h-4" /> },
  { id: 'english', name: 'لغة إنجليزية', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'physics', name: 'فيزياء', icon: <Zap className="w-4 h-4" /> },
  { id: 'chemistry', name: 'كيمياء', icon: <Award className="w-4 h-4" /> },
  { id: 'biology', name: 'أحياء', icon: <Droplets className="w-4 h-4" /> },
  { id: 'history', name: 'تاريخ', icon: <HistoryIcon className="w-4 h-4" /> },
  { id: 'geography', name: 'جغرافيا', icon: <MapPin className="w-4 h-4" /> },
];

const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'أ/ محمد إبراهيم',
    subject: 'رياضيات',
    rating: 4.9,
    reviews: 156,
    pricePerHour: 100,
    image: 'https://picsum.photos/seed/t1/200/200',
    isVerified: true,
    experience: '10 سنوات خبرة',
    education: 'بكالوريوس تربية قسم رياضيات - جامعة القاهرة',
    location: 'القاهرة، مدينة نصر',
    languages: ['العربية', 'الإنجليزية'],
    description: 'مدرس أول رياضيات للمرحلة الثانوية، متخصص في تبسيط المسائل المعقدة.',
    about: 'أؤمن بأن الرياضيات ليست مجرد أرقام، بل هي لغة الكون. أعمل على تبسيط المفاهيم الرياضية لطلابي من خلال ربطها بالواقع العملي واستخدام أحدث الوسائل التكنولوجية في التعليم.',
    schedule: [
      { day: 'السبت', times: ['04:00 م', '06:00 م'] },
      { day: 'الاثنين', times: ['06:00 م', '08:00 م'] },
    ],
    stats: {
      students: 1200,
      hours: 4500,
      courses: 15
    },
    gallery: [
      'https://picsum.photos/seed/edu1/400/300',
      'https://picsum.photos/seed/edu2/400/300',
      'https://picsum.photos/seed/edu3/400/300',
      'https://picsum.photos/seed/edu4/400/300',
    ],
    projects: [
      { id: 'p1', title: 'مراجعة ليلة الامتحان 2025', description: 'ملخص شامل لجميع قوانين التفاضل والتكامل مع حل نماذج الوزارة.', image: 'https://picsum.photos/seed/proj1/400/300' },
      { id: 'p2', title: 'سلسلة التفوق في الجبر', description: 'شرح مبسط لدروس المصفوفات والمحددات لطلاب الصف الثالث الثانوي.', image: 'https://picsum.photos/seed/proj2/400/300' },
    ],
    reviewsList: [
      { id: 'r1', name: 'أحمد علي', rating: 5, comment: 'مدرس ممتاز جداً وشرحه مبسط وممتع.', date: 'منذ يومين', avatar: 'https://picsum.photos/seed/u1/100/100' },
      { id: 'r2', name: 'سارة محمود', rating: 4, comment: 'استفدت جداً من الحصة، شكراً جزيلاً.', date: 'منذ أسبوع', avatar: 'https://picsum.photos/seed/u2/100/100' },
      { id: 'r3', name: 'ياسين حسن', rating: 5, comment: 'أفضل مدرس رياضيات تعاملت معه على الإطلاق.', date: 'منذ أسبوعين', avatar: 'https://picsum.photos/seed/u3/100/100' },
    ]
  },
  {
    id: '2',
    name: 'أ/ سارة أحمد',
    subject: 'لغة إنجليزية',
    rating: 4.8,
    reviews: 92,
    pricePerHour: 120,
    image: 'https://picsum.photos/seed/t2/200/200',
    isVerified: true,
    experience: '7 سنوات خبرة',
    education: 'ليسانس آداب إنجليزي - جامعة عين شمس',
    location: 'الجيزة، الدقي',
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    description: 'خبيرة في تدريس اللغة الإنجليزية والتحضير لشهادات الآيلتس.',
    about: 'أركز في دروسي على مهارات التحدث بطلاقة واكتساب الثقة في استخدام اللغة الإنجليزية في المواقف الحياتية المختلفة، بالإضافة إلى التميز الأكاديمي.',
    schedule: [
      { day: 'الأحد', times: ['05:00 م', '07:00 م'] },
      { day: 'الثلاثاء', times: ['05:00 م', '07:00 م'] },
    ],
    stats: {
      students: 850,
      hours: 3200,
      courses: 8
    },
    gallery: [
      'https://picsum.photos/seed/edu5/400/300',
      'https://picsum.photos/seed/edu6/400/300',
      'https://picsum.photos/seed/edu7/400/300',
    ],
    reviewsList: [
      { id: 'r4', name: 'ليلى محمد', rating: 5, comment: 'طريقة تدريسها رائعة ومحفزة جداً.', date: 'منذ 3 أيام', avatar: 'https://picsum.photos/seed/u4/100/100' },
      { id: 'r5', name: 'عمر خالد', rating: 4, comment: 'تحسنت لغتي الإنجليزية بشكل ملحوظ معها.', date: 'منذ شهر', avatar: 'https://picsum.photos/seed/u5/100/100' },
    ]
  },
];

type ViewState = 'home' | 'list' | 'profile' | 'booking' | 'onboarding' | 'dashboard' | 'chat' | 'history' | 'notifications' | 'filter' | 'offers' | 'availability' | 'wallet' | 'booking-summary';

export default function TeachersScreen({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubject, setActiveSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const filteredTeachers = MOCK_TEACHERS.filter(t => {
    const matchesSearch = !searchQuery || t.name.includes(searchQuery) || t.subject.includes(searchQuery);
    const matchesSubject = activeSubject === 'all' || t.subject === SUBJECTS.find(s => s.id === activeSubject)?.name;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(t.id);
    return matchesSearch && matchesSubject && matchesFavorites;
  });

  const goToHome = () => navigate('');
  const goToList = (subjectId: string) => {
    setActiveSubject(subjectId);
    setShowFavoritesOnly(false);
    navigate('list');
  };
  const goToProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    navigate(`profile/${teacher.id}`);
  };
  const goToBooking = () => navigate(`booking/${selectedTeacher?.id}`);
  const goToBookingSummary = () => navigate(`booking-summary/${selectedTeacher?.id}`);
  const goToOnboarding = () => navigate('onboarding');
  const goToDashboard = () => navigate('dashboard');
  const goToChat = (chat: Chat) => {
    setSelectedChat(chat);
    navigate(`chat/${chat.id}`);
  };
  const goToHistory = () => navigate('history');
  const goToNotifications = () => navigate('notifications');
  const goToFilter = () => navigate('filter');
  const goToOffers = () => navigate('offers');
  const goToAvailability = () => navigate('availability');
  const goToWallet = () => navigate('wallet');

  const HomeView = () => (
    <div className="space-y-8 pb-24">
      {/* Hero Section */}
      <div className="bg-royal-600 px-6 pt-12 pb-20 rounded-b-[48px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-royal-500 rounded-full -mr-32 -mt-32 opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-royal-400 rounded-full -ml-24 -mb-24 opacity-10" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-white">
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={goToNotifications}
                className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-white relative"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-royal-600" />
              </button>
              <button 
                onClick={() => {
                  setActiveSubject('all');
                  setShowFavoritesOnly(true);
                  navigate('list');
                }}
                className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-white"
              >
                <Star className={`w-6 h-6 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
              <button 
                onClick={goToOnboarding}
                className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-black rounded-xl border border-white/20"
              >
                انضم كمدرس
              </button>
              <button onClick={goToDashboard} className="p-2.5 bg-white rounded-2xl text-royal-600 shadow-xl">
                <LayoutDashboard className="w-6 h-6" />
              </button>
              <button onClick={goToHistory} className="p-2.5 bg-white rounded-2xl text-royal-600 shadow-xl">
                <HistoryIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white leading-tight">تعلم من الأفضل<br/>في كل المجالات</h1>
            <p className="text-royal-100 text-sm font-bold opacity-80">أكثر من 5000 مدرس معتمد في انتظارك</p>
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن مدرس أو مادة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('list')}
              className="w-full bg-white rounded-2xl py-4 pr-12 pl-12 text-sm font-bold shadow-2xl shadow-royal-900/20 border-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">التصنيفات</h2>
          <button onClick={() => goToList('all')} className="text-royal-600 text-xs font-black">عرض الكل</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {SUBJECTS.slice(1).map(sub => (
            <button 
              key={sub.id}
              onClick={() => goToList(sub.id)}
              className="bg-white dark:bg-slate-900 p-4 rounded-[28px] shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-3 transition-all active:scale-95 min-w-[100px]"
            >
              <div className="w-12 h-12 bg-royal-50 dark:bg-royal-900/20 rounded-2xl flex items-center justify-center text-royal-600">
                {sub.icon}
              </div>
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 whitespace-nowrap">{sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">كيف يعمل التطبيق؟</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Search className="w-5 h-5" />, title: 'ابحث', color: 'bg-blue-500' },
            { icon: <Calendar className="w-5 h-5" />, title: 'احجز', color: 'bg-purple-500' },
            { icon: <GraduationCap className="w-5 h-5" />, title: 'تعلم', color: 'bg-green-500' },
          ].map((step, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-50 dark:border-slate-800 text-center space-y-2">
              <div className={`${step.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg`}>
                {step.icon}
              </div>
              <p className="text-[10px] font-black text-slate-900 dark:text-white">{step.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Teachers - Horizontal Scroll */}
      <div className="space-y-4">
        <div className="px-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">الأعلى تقييماً</h2>
          <button className="text-royal-600 text-xs font-black">عرض الكل</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4">
          {MOCK_TEACHERS.map(teacher => (
            <button 
              key={`top-${teacher.id}`}
              onClick={() => goToProfile(teacher)}
              className="min-w-[240px] bg-white dark:bg-slate-900 p-5 rounded-[40px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 text-right space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={teacher.image} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-lg shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">{teacher.name}</h3>
                  <p className="text-[10px] text-royal-600 font-bold">{teacher.subject}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">السعر</div>
                <div className="text-sm font-black text-royal-600">{teacher.pricePerHour} ج.م</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div className="px-6">
        <div 
          onClick={goToOffers}
          className="relative h-44 rounded-[40px] overflow-hidden shadow-xl shadow-royal-900/20 group cursor-pointer"
        >
          <img src="https://picsum.photos/seed/edu/800/400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-l from-royal-900/80 to-transparent flex flex-col justify-center p-8 text-white">
            <span className="bg-amber-500 text-[8px] font-black px-2 py-1 rounded-full w-fit mb-2 uppercase tracking-widest">عرض محدود</span>
            <h3 className="text-xl font-black mb-1">خصم 30% على أول حصة</h3>
            <p className="text-[10px] font-bold opacity-80 mb-4">استخدم كود: TEACH30</p>
            <button className="bg-white text-royal-600 text-[10px] font-black px-6 py-2.5 rounded-xl w-fit">احجز الآن</button>
          </div>
        </div>
      </div>

      {/* Featured Teachers */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">مدرسين متميزين</h2>
          <button className="text-royal-600 text-xs font-black">عرض الكل</button>
        </div>
        <div className="space-y-4">
          {MOCK_TEACHERS.map(teacher => (
            <div 
              key={teacher.id}
              onClick={() => goToProfile(teacher)}
              className="w-full bg-white dark:bg-slate-900 p-4 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-4 items-center text-right cursor-pointer"
            >
              <div className="relative">
                <img src={teacher.image} className="w-20 h-20 rounded-2xl object-cover" />
                <button 
                  onClick={(e) => toggleFavorite(teacher.id, e)}
                  className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <Star className={`w-3 h-3 ${favorites.includes(teacher.id) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                </button>
                <div className="absolute -bottom-2 -left-2 bg-white dark:bg-slate-900 p-1 rounded-lg shadow-sm">
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {teacher.rating}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white">{teacher.name}</h3>
                  {teacher.isVerified && <CheckCircle2 className="w-4 h-4 text-royal-600" />}
                </div>
                <p className="text-xs text-royal-600 font-bold">{teacher.subject}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {teacher.experience}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {teacher.stats.students} طالب</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-900 dark:text-white">{teacher.pricePerHour}</div>
                <div className="text-[8px] text-slate-400 font-bold uppercase">ج.م / ساعة</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {showFavoritesOnly ? 'المفضلات' : (searchQuery ? 'نتائج البحث' : SUBJECTS.find(s => s.id === activeSubject)?.name)}
            </h1>
          </div>
          <button onClick={goToFilter} className="p-2.5 bg-royal-600 text-white rounded-2xl shadow-lg shadow-royal-600/20">
            <Filter className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {SUBJECTS.map(sub => (
            <button 
              key={sub.id}
              onClick={() => {
                setActiveSubject(sub.id);
                setShowFavoritesOnly(false);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                !showFavoritesOnly && activeSubject === sub.id 
                ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/20' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 space-y-4">
        {filteredTeachers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
              <Search className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 dark:text-white">لا يوجد نتائج</h3>
              <p className="text-xs text-slate-400 font-bold">جرب البحث بكلمات أخرى أو تغيير الفلاتر</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setActiveSubject('all'); setShowFavoritesOnly(false); }}
              className="text-royal-600 text-xs font-black"
            >
              إعادة ضبط البحث
            </button>
          </div>
        )}
        {filteredTeachers.map((teacher, i) => (
          <motion.button 
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => goToProfile(teacher)}
            className="w-full bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-4 items-center text-right"
          >
            <img src={teacher.image} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1 space-y-1">
              <h3 className="font-black text-slate-900 dark:text-white">{teacher.name}</h3>
              <p className="text-xs text-royal-600 font-bold">{teacher.subject}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {teacher.rating}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {teacher.location}</span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('about');
    if (!selectedTeacher) return null;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
        {/* Profile Header */}
        <div className="relative h-64 bg-royal-600">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute top-8 right-6 left-6 flex justify-between items-center z-10">
            <button onClick={() => navigate('list')} className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white">
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleFavorite(selectedTeacher.id)}
                className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white"
              >
                <Star className={`w-6 h-6 ${favorites.includes(selectedTeacher.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
              <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="absolute -bottom-16 right-6 flex items-end gap-4">
            <div className="relative">
              <img src={selectedTeacher.image} className="w-32 h-32 rounded-[40px] border-4 border-white dark:border-slate-950 object-cover shadow-2xl" />
              {selectedTeacher.isVerified && (
                <div className="absolute -bottom-2 -left-2 bg-royal-600 text-white p-2 rounded-2xl border-4 border-white dark:border-slate-950">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 px-6 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{selectedTeacher.name}</h1>
              <div className="text-xl font-black text-royal-600">{selectedTeacher.pricePerHour} <span className="text-xs text-slate-400">ج.م/ساعة</span></div>
            </div>
            <p className="text-royal-600 font-bold">{selectedTeacher.subject}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedTeacher.location}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {selectedTeacher.rating} ({selectedTeacher.reviews} مراجعة)</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800">
            {['about', 'projects', 'reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-royal-600' : 'text-slate-400'}`}
              >
                {tab === 'about' ? 'عن المدرس' : tab === 'projects' ? 'الأعمال' : 'التقييمات'}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-royal-600 rounded-full" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 text-center space-y-1">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{selectedTeacher.stats.students}+</div>
                    <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">طالب</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 text-center space-y-1">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{selectedTeacher.stats.hours}</div>
                    <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">ساعة تدريس</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 text-center space-y-1">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{selectedTeacher.stats.courses}</div>
                    <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">دورة تدريبية</div>
                  </div>
                </div>

                {/* Video Introduction */}
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">فيديو تعريفي</h2>
                  <div className="relative aspect-video rounded-[40px] overflow-hidden group cursor-pointer shadow-2xl shadow-royal-900/20">
                    <img src="https://picsum.photos/seed/video/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-royal-600 shadow-xl">
                          <Video className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-6 left-6 text-white">
                      <p className="text-xs font-black opacity-80">شاهد كيف أدرس</p>
                      <h4 className="text-sm font-black">مقدمة في منهج الرياضيات</h4>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">عن المدرس</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    {selectedTeacher.about}
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">التعليم والخبرة</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600 shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">المؤهل الأكاديمي</h4>
                        <p className="text-xs text-slate-400 font-bold">{selectedTeacher.education}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">الخبرة المهنية</h4>
                        <p className="text-xs text-slate-400 font-bold">{selectedTeacher.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">الموقع</h2>
                  <div className="bg-slate-100 dark:bg-slate-800 h-40 rounded-[32px] relative overflow-hidden flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-slate-300" />
                    <div className="absolute bottom-4 right-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/20">
                      <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600 shrink-0">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white">{selectedTeacher.location}</h4>
                        <p className="text-[8px] text-slate-400 font-bold">يبعد 2.5 كم عنك</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6">
                  {selectedTeacher.projects?.map(project => (
                    <div key={project.id} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm">
                      <div className="aspect-video relative">
                        <img src={project.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 right-6 text-white">
                          <h3 className="text-lg font-black">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedTeacher.projects || selectedTeacher.projects.length === 0) && (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <p className="text-sm text-slate-400 font-bold">لا توجد أعمال معروضة حالياً</p>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                {selectedTeacher.gallery && selectedTeacher.gallery.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">معرض الصور</h2>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                      {selectedTeacher.gallery.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          className="w-48 h-32 rounded-[32px] object-cover shadow-lg" 
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">آراء الطلاب</h2>
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    <Star className="w-4 h-4 fill-current" /> {selectedTeacher.rating}
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedTeacher.reviewsList?.map(review => (
                    <div key={review.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={review.avatar} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{review.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{review.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
          <div className="max-w-md mx-auto flex gap-4">
            <button 
              onClick={() => goToChat({
                id: 'c1',
                participantName: selectedTeacher.name,
                participantImage: selectedTeacher.image,
                lastMessage: '',
                time: '',
                unreadCount: 0
              })}
              className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <button 
              onClick={goToBooking}
              className="flex-1 py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
            >
              احجز موعداً الآن
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BookingView = () => {
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const times = ['10:00 ص', '12:00 م', '02:00 م', '04:00 م', '06:00 م', '08:00 م'];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">حجز موعد</h1>
          </div>
        </header>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">اختر اليوم</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {days.map(day => (
                <button 
                  key={day}
                  onClick={() => setBookingDate(day)}
                  className={`px-6 py-4 rounded-3xl text-sm font-black transition-all whitespace-nowrap ${
                    bookingDate === day 
                    ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">اختر الوقت</h2>
            <div className="grid grid-cols-3 gap-3">
              {times.map(time => (
                <button 
                  key={time}
                  onClick={() => setBookingTime(time)}
                  className={`py-4 rounded-2xl text-xs font-black transition-all ${
                    bookingTime === time 
                    ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">نوع الحصة</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border-2 border-royal-600 flex flex-col items-center gap-3">
                <Video className="w-8 h-8 text-royal-600" />
                <span className="text-xs font-black text-slate-900 dark:text-white">أونلاين</span>
              </button>
              <button className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border-2 border-transparent flex flex-col items-center gap-3">
                <Users className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-black text-slate-400">حضوري</span>
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
          <button 
            disabled={!bookingDate || !bookingTime}
            onClick={goToBookingSummary}
            className="w-full py-4 bg-royal-600 disabled:bg-slate-200 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
          >
            متابعة الحجز
          </button>
        </div>
      </div>
    );
  };

  const BookingSummaryView = () => {
    if (!selectedTeacher) return null;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">ملخص الحجز</h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedTeacher.image} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h3 className="font-black text-slate-900 dark:text-white">{selectedTeacher.name}</h3>
                <p className="text-xs text-royal-600 font-bold">{selectedTeacher.subject}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">التاريخ</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{bookingDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الوقت</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{bookingTime}</p>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-slate-50 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">نوع الحصة</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">أونلاين (فيديو)</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white">تفاصيل الدفع</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">سعر الحصة</span>
                <span className="text-slate-900 dark:text-white">{selectedTeacher.pricePerHour} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">رسوم الخدمة</span>
                <span className="text-slate-900 dark:text-white">10 ج.م</span>
              </div>
              <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white">الإجمالي</span>
                <span className="text-xl font-black text-royal-600">{selectedTeacher.pricePerHour + 10} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
          <button 
            onClick={() => {
              // In a real app, we'd show a success modal
              goToHome();
            }}
            className="w-full py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
          >
            تأكيد الدفع والحجز
          </button>
        </div>
      </div>
    );
  };

  const OnboardingView = () => {
    const steps = [
      { id: 1, title: 'المعلومات الشخصية' },
      { id: 2, title: 'التخصص والخبرة' },
      { id: 3, title: 'التوثيق والشهادات' },
      { id: 4, title: 'الأعمال والمشاريع' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">انضم كمدرس</h1>
          </div>
          <div className="flex gap-2 mt-6">
            {steps.map(s => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${s.id <= onboardingStep ? 'bg-royal-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
            ))}
          </div>
        </header>

        <div className="p-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{steps[onboardingStep - 1].title}</h2>
            <p className="text-sm text-slate-400 font-bold">أكمل البيانات التالية لتوثيق حسابك</p>
          </div>

          <AnimatePresence mode="wait">
            {onboardingStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">الاسم بالكامل</label>
                  <input type="text" placeholder="مثال: د. أحمد محمد" className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">الموقع</label>
                  <input type="text" placeholder="مثال: القاهرة، مدينة نصر" className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm" />
                </div>
              </motion.div>
            )}

            {onboardingStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">المادة الدراسية</label>
                  <select className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm appearance-none">
                    {SUBJECTS.slice(1).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">سعر الساعة (ج.م)</label>
                  <input type="number" placeholder="مثال: 150" className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm" />
                </div>
              </motion.div>
            )}

            {onboardingStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">يرجى رفع صورة من شهادة التخرج أو كارنيه النقابة لتوثيق حسابك.</p>
                </div>
                <button className="w-full aspect-video rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Camera className="w-12 h-12" />
                  <span className="font-black">رفع المستندات</span>
                </button>
              </motion.div>
            )}

            {onboardingStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-royal-50 dark:bg-royal-900/10 border border-royal-100 dark:border-royal-900/30 p-4 rounded-2xl flex gap-3">
                  <BookOpen className="w-5 h-5 text-royal-600 shrink-0" />
                  <p className="text-xs text-royal-700 dark:text-royal-400 font-bold leading-relaxed">أضف نماذج من أعمالك، مذكراتك، أو فيديوهات شرح لتعزيز بروفايلك.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="aspect-square rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-royal-50 dark:hover:bg-royal-900/10 transition-colors">
                    <ImagePlus className="w-8 h-8 text-royal-600" />
                    <span className="text-[10px] font-black">إضافة عمل</span>
                  </button>
                  <div className="aspect-square rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 flex flex-col justify-between shadow-sm">
                    <div className="w-full h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img src="https://picsum.photos/seed/p1/200/200" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">مراجعة ليلة الامتحان</p>
                      <p className="text-[8px] text-slate-400 font-bold">ملف PDF</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">فيديو تعريفي (اختياري)</h3>
                  <button className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400">رابط فيديو يوتيوب</span>
                    </div>
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-royal-600 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-8">
            {onboardingStep > 1 && (
              <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black">السابق</button>
            )}
            <button 
              onClick={() => {
                if (onboardingStep < 4) setOnboardingStep(onboardingStep + 1);
                else {
                  setUserRole('teacher');
                  goToDashboard();
                }
              }}
              className="flex-[2] py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
            >
              {onboardingStep === 4 ? 'إكمال التسجيل' : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-royal-100">
              <img src="https://picsum.photos/seed/pro/100/100" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">لوحة المدرس</h1>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> متصل الآن
              </div>
            </div>
          </div>
          <button onClick={() => { setUserRole('student'); goToHome(); }} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <User className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600"><Users className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">12</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">طالب نشط</div>
          </div>
          <button 
            onClick={goToWallet}
            className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2 text-right"
          >
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">4.5k</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الأرباح (ج.م)</div>
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">طلابي</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {[
              { name: 'ياسين حسن', image: 'https://picsum.photos/seed/s1/100/100', level: 'ثانوي' },
              { name: 'ليلى محمد', image: 'https://picsum.photos/seed/s2/100/100', level: 'إعدادي' },
              { name: 'عمر خالد', image: 'https://picsum.photos/seed/s3/100/100', level: 'ثانوي' },
              { name: 'سارة محمود', image: 'https://picsum.photos/seed/s4/100/100', level: 'ابتدائي' },
            ].map((student, i) => (
              <div key={i} className="min-w-[100px] bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-50 dark:border-slate-800 text-center space-y-2 shadow-sm">
                <img src={student.image} className="w-12 h-12 rounded-2xl object-cover mx-auto" />
                <div>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">{student.name}</p>
                  <p className="text-[8px] text-royal-600 font-bold">{student.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">الحصص القادمة</h2>
          {[
            { id: 's1', student: 'أحمد علي', time: 'اليوم، 04:00 م', type: 'أونلاين' },
            { id: 's2', student: 'سارة محمود', time: 'غداً، 10:00 ص', type: 'حضوري' },
          ].map(session => (
            <div key={session.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{session.student}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{session.time}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-royal-50 dark:bg-royal-900/20 text-royal-600 text-[10px] font-black rounded-full">{session.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={goToDashboard} className={`p-3 ${location.pathname.includes('dashboard') ? 'text-royal-600' : 'text-slate-400'}`}><LayoutDashboard className="w-6 h-6" /></button>
          <button onClick={goToAvailability} className={`p-3 ${location.pathname.includes('availability') ? 'text-royal-600' : 'text-slate-400'}`}><Calendar className="w-6 h-6" /></button>
          <button className="p-3 text-slate-400"><MessageSquare className="w-6 h-6" /></button>
          <button onClick={goToWallet} className={`p-3 ${location.pathname.includes('wallet') ? 'text-royal-600' : 'text-slate-400'}`}><TrendingUp className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );

  const ChatView = () => {
    const { id } = useParams();
    // In a real app, we'd find the chat by ID. For now, we use selectedChat or a default.
    const chat = selectedChat || { id: id || 'new', participantName: 'مدرس', participantImage: 'https://picsum.photos/seed/t1/200/200', lastMessage: '', time: '', unreadCount: 0 };
    
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <img src={chat.participantImage} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h1 className="text-sm font-black text-slate-900 dark:text-white">{chat.participantName}</h1>
                  <span className="text-[10px] text-emerald-600 font-bold">متصل الآن</span>
                </div>
              </div>
            </div>
            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600"><Phone className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-3 max-w-[80%]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] rounded-br-none shadow-sm border border-slate-50 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">أهلاً بك! كيف يمكنني مساعدتك في مادة الرياضيات؟</p>
              <span className="text-[8px] text-slate-400 font-bold mt-2 block">10:00 ص</span>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3 max-w-[80%] mr-auto">
            <div className="bg-royal-600 p-4 rounded-[24px] rounded-bl-none shadow-xl shadow-royal-600/20 text-white">
              <p className="text-xs font-bold">أريد حجز حصة لمراجعة التفاضل والتكامل، هل أنت متاح غداً؟</p>
              <span className="text-[8px] opacity-70 font-bold mt-2 block">10:05 ص</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl"><Plus className="w-6 h-6" /></button>
            <div className="flex-1 relative">
              <input type="text" placeholder="اكتب رسالتك هنا..." className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-[24px] py-4 pr-6 pl-12 text-sm font-bold transition-all" />
              <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-royal-600 text-white rounded-xl shadow-lg shadow-royal-600/20"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">سجل الحصص</h1>
        </div>
      </header>
      <div className="p-6 space-y-4">
        {[
          { id: 'h1', teacher: 'أ/ محمد إبراهيم', subject: 'رياضيات', date: '24 مارس 2026', time: '04:00 م', status: 'completed', price: 100 },
          { id: 'h2', teacher: 'أ/ سارة أحمد', subject: 'لغة إنجليزية', date: '20 مارس 2026', time: '05:00 م', status: 'completed', price: 120 },
        ].map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-royal-50 dark:bg-royal-900/20 rounded-2xl flex items-center justify-center text-royal-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.teacher}</h4>
                  <p className="text-[10px] text-royal-600 font-bold">{item.subject}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black rounded-full">مكتملة</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white">{item.price} ج.م</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">الإشعارات</h1>
        </div>
      </header>
      <div className="p-6 space-y-4">
        {[
          { id: 'n1', title: 'تذكير بالحصة', body: 'حصة الرياضيات مع أ/ محمد ستبدأ بعد ساعة من الآن.', time: 'منذ ساعة', type: 'reminder' },
          { id: 'n2', title: 'تم تأكيد الحجز', body: 'تم قبول طلب حجزك مع أ/ سارة أحمد بنجاح.', time: 'منذ ساعتين', type: 'success' },
          { id: 'n3', title: 'عرض جديد', body: 'خصم 20% على جميع حصص اللغة الإنجليزية لنهاية الأسبوع.', time: 'منذ يوم', type: 'offer' },
        ].map(notif => (
          <div key={notif.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              notif.type === 'reminder' ? 'bg-royal-50 text-royal-600' :
              notif.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              {notif.type === 'reminder' ? <Clock className="w-5 h-5" /> :
               notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
               <Tag className="w-5 h-5" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{notif.title}</h4>
                <span className="text-[8px] text-slate-400 font-bold">{notif.time}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{notif.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FilterView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('list')} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <X className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">تصفية البحث</h1>
          </div>
          <button className="text-royal-600 text-xs font-black">إعادة ضبط</button>
        </div>
      </header>
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">المادة الدراسية</h2>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(sub => (
              <button 
                key={sub.id}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  activeSubject === sub.id ? 'bg-royal-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-50 dark:border-slate-800'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">نطاق السعر (ساعة)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 mr-2">من</label>
              <input type="number" placeholder="50" className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 text-sm font-bold shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 mr-2">إلى</label>
              <input type="number" placeholder="500" className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 text-sm font-bold shadow-sm" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">التقييم</h2>
          <div className="flex gap-2">
            {[5, 4, 3, 2].map(star => (
              <button key={star} className="flex-1 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800 flex items-center justify-center gap-1 text-xs font-black text-slate-600">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {star}+
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <button onClick={() => navigate('list')} className="w-full py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20">تطبيق الفلاتر</button>
      </div>
    </div>
  );

  const OffersView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">العروض والخصومات</h1>
        </div>
      </header>
      <div className="p-6 space-y-6">
        {[
          { id: 'o1', title: 'خصم العودة للمدارس', body: 'خصم 50% على جميع حصص المراجعة النهائية لطلاب الثانوية العامة.', code: 'SCHOOL50', color: 'bg-royal-600' },
          { id: 'o2', title: 'باقة التفوق', body: 'احجز 5 حصص واحصل على الحصة السادسة مجاناً.', code: 'EXCEL6', color: 'bg-emerald-600' },
          { id: 'o3', title: 'عرض الصداقة', body: 'ادعُ صديقاً واحصل كلاكما على رصيد 50 ج.م في محفظتك.', code: 'FRIEND50', color: 'bg-amber-600' },
        ].map(offer => (
          <div key={offer.id} className={`${offer.color} p-8 rounded-[48px] text-white space-y-6 relative overflow-hidden shadow-xl`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl font-black">{offer.title}</h3>
              <p className="text-sm font-bold opacity-80 leading-relaxed">{offer.body}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">كود الخصم</span>
                <div className="text-lg font-black tracking-wider">{offer.code}</div>
              </div>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-xs font-black shadow-lg">نسخ الكود</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AvailabilityView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={goToDashboard} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">جدول المواعيد</h1>
        </div>
      </header>
      <div className="p-6 space-y-8">
        {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(day => (
          <div key={day} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{day}</h3>
              <button className="p-2 bg-royal-50 dark:bg-royal-900/20 text-royal-600 rounded-xl"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['10:00 ص', '02:00 م', '06:00 م'].map(time => (
                <div key={time} className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-50 dark:border-slate-800 text-[10px] font-black text-slate-600 flex items-center gap-2">
                  {time} <X className="w-3 h-3 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <button onClick={goToDashboard} className="w-full py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20">حفظ التغييرات</button>
      </div>
    </div>
  );

  const WalletView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={goToDashboard} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">المحفظة والأرباح</h1>
        </div>
      </header>
      <div className="p-6 space-y-8">
        <div className="bg-royal-600 p-8 rounded-[48px] text-white space-y-4 shadow-xl shadow-royal-600/20">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">الرصيد القابل للسحب</span>
          <div className="text-4xl font-black">4,520 <span className="text-sm opacity-60">ج.م</span></div>
          <button className="w-full py-4 bg-white text-royal-600 rounded-2xl font-black text-sm shadow-lg">طلب سحب الأرباح</button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">آخر العمليات</h2>
          {[
            { id: 't1', title: 'حصة رياضيات - أحمد علي', amount: '+100', date: 'اليوم، 05:00 م', type: 'income' },
            { id: 't2', title: 'سحب رصيد - بنك مصر', amount: '-2000', date: '24 مارس، 10:00 ص', type: 'withdraw' },
            { id: 't3', title: 'حصة لغة إنجليزية - سارة', amount: '+120', date: '23 مارس، 06:00 م', type: 'income' },
          ].map(trans => (
            <div key={trans.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trans.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {trans.type === 'income' ? <Plus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5 rotate-45" />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{trans.title}</h4>
                  <p className="text-[8px] text-slate-400 font-bold">{trans.date}</p>
                </div>
              </div>
              <div className={`text-sm font-black ${trans.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{trans.amount} ج.م</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans" dir="rtl">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView />
            </motion.div>
          } />
          <Route path="list" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ListView />
            </motion.div>
          } />
          <Route path="profile/:id" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfileView />
            </motion.div>
          } />
          <Route path="booking/:id" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BookingView />
            </motion.div>
          } />
          <Route path="booking-summary/:id" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BookingSummaryView />
            </motion.div>
          } />
          <Route path="onboarding" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OnboardingView />
            </motion.div>
          } />
          <Route path="dashboard" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DashboardView />
            </motion.div>
          } />
          <Route path="chat/:id" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ChatView />
            </motion.div>
          } />
          <Route path="history" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HistoryView />
            </motion.div>
          } />
          <Route path="notifications" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NotificationsView />
            </motion.div>
          } />
          <Route path="filter" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FilterView />
            </motion.div>
          } />
          <Route path="offers" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OffersView />
            </motion.div>
          } />
          <Route path="availability" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AvailabilityView />
            </motion.div>
          } />
          <Route path="wallet" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WalletView />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .font-sans { font-family: 'Cairo', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
