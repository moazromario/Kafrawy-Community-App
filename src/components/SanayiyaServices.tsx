import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  MessageSquare,
  ChevronLeft,
  Wrench,
  Zap,
  SlidersHorizontal,
  Hammer,
  Paintbrush,
  Award,
  Bell,
  Calendar,
  CheckCircle,
  Image as ImageIcon,
  Info,
  MessageCircle,
  Truck,
  HardHat,
  Camera,
  CreditCard,
  Wallet,
  Banknote,
  Map,
  CheckCircle2,
  History,
  Send,
  User,
  ChevronRight,
  X,
  MoreVertical,
  Plus,
} from 'lucide-react';

// --- Types ---
interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  worksDone: number;
  pricePerHour: number;
  experience: number;
  distance: string;
  isAvailable: boolean;
  isVerified: boolean;
  image: string;
  description: string;
  portfolio: PortfolioProject[];
  services: Service[];
  reviews: Review[];
}

interface PastService {
  id: string;
  providerName: string;
  providerImage: string;
  serviceName: string;
  date: string;
  price: number;
  status: 'completed' | 'cancelled';
}

interface UpcomingService {
  id: string;
  providerName: string;
  providerImage: string;
  serviceName: string;
  date: string;
  time: string;
  reminderTime: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  before: string;
  after: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'status' | 'offer';
  isRead: boolean;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  image: string;
  color: string;
}

// --- Mock Data ---
const CATEGORIES = [
  { id: 'plumber', name: 'سباكة', icon: <Wrench className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'electrician', name: 'كهرباء', icon: <Zap className="w-6 h-6" />, color: 'bg-amber-500' },
  { id: 'carpenter', name: 'نجارة', icon: <Hammer className="w-6 h-6" />, color: 'bg-orange-600' },
  { id: 'painter', name: 'دهانات', icon: <Paintbrush className="w-6 h-6" />, color: 'bg-rose-500' },
  { id: 'mover', name: 'نقل أثاث', icon: <Truck className="w-6 h-6" />, color: 'bg-emerald-500' },
  { id: 'general', name: 'صيانة عامة', icon: <HardHat className="w-6 h-6" />, color: 'bg-indigo-500' },
];

const MOCK_PROVIDERS: Provider[] = [
  { 
    id: '1', 
    name: 'الأسطى محمد حسن', 
    category: 'plumber', 
    rating: 4.9, 
    reviewsCount: 124, 
    worksDone: 450,
    pricePerHour: 150,
    experience: 15,
    distance: '0.8 كم', 
    isAvailable: true, 
    isVerified: true, 
    image: 'https://picsum.photos/seed/p1/400/400',
    description: 'خبرة أكثر من 15 عاماً في أعمال السباكة المنزلية والشبكات الرئيسية. دقة في المواعيد وأمانة في العمل.',
    portfolio: [
      { id: 'w1', title: 'تجديد حمام كامل', before: 'https://picsum.photos/seed/b1/400/300', after: 'https://picsum.photos/seed/a1/400/300' },
      { id: 'w2', title: 'إصلاح شبكة مياه', before: 'https://picsum.photos/seed/b2/400/300', after: 'https://picsum.photos/seed/a2/400/300' },
    ],
    services: [
      { id: 's1', name: 'تصليح تسريب مياه', price: 100, duration: '1 ساعة' },
      { id: 's2', name: 'تركيب طقم حمام كامل', price: 800, duration: '5 ساعات' },
      { id: 's3', name: 'صيانة سخان غاز/كهرباء', price: 150, duration: '1.5 ساعة' },
    ],
    reviews: [
      { id: 'r1', userName: 'أحمد علي', userImage: 'https://picsum.photos/seed/u1/100/100', rating: 5, comment: 'شغل ممتاز وسريع جداً', date: 'منذ يومين' },
      { id: 'r2', userName: 'سارة محمود', userImage: 'https://picsum.photos/seed/u2/100/100', rating: 4, comment: 'محترم جداً في مواعيده', date: 'منذ أسبوع' },
    ]
  },
  { 
    id: '2', 
    name: 'المهندس هاني كهرباء', 
    category: 'electrician', 
    rating: 4.7, 
    reviewsCount: 89, 
    worksDone: 320,
    pricePerHour: 200,
    experience: 10,
    distance: '1.2 كم', 
    isAvailable: true, 
    isVerified: true, 
    image: 'https://picsum.photos/seed/p2/400/400',
    description: 'متخصص في تأسيس وصيانة الكهرباء المنزلية، تركيب النجف والكشافات، وحل أعطال لوحات المفاتيح.',
    portfolio: [
      { id: 'w3', title: 'تأسيس لوحة كهرباء', before: 'https://picsum.photos/seed/b3/400/300', after: 'https://picsum.photos/seed/a3/400/300' },
    ],
    services: [
      { id: 's4', name: 'تركيب نجفة', price: 150, duration: '1 ساعة' },
      { id: 's5', name: 'تأسيس شقة كاملة', price: 5000, duration: '7 أيام' },
    ],
    reviews: []
  },
];

const MOCK_HISTORY: PastService[] = [
  {
    id: 'h1',
    providerName: 'الأسطى محمد حسن',
    providerImage: 'https://picsum.photos/seed/p1/400/400',
    serviceName: 'تصليح تسريب مياه',
    date: '15 مارس 2026',
    price: 120,
    status: 'completed'
  },
  {
    id: 'h2',
    providerName: 'المهندس هاني كهرباء',
    providerImage: 'https://picsum.photos/seed/p2/400/400',
    serviceName: 'تركيب نجفة',
    date: '10 مارس 2026',
    price: 170,
    status: 'completed'
  }
];

const MOCK_ADDRESSES = [
  { id: 'a1', label: 'المنزل', address: 'شارع الجمهورية، كفر الشيخ', isDefault: true },
  { id: 'a2', label: 'العمل', address: 'برج الأمل، الدور الرابع، كفر الشيخ', isDefault: false },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'تم تأكيد الحجز', message: 'تم تأكيد حجزك مع الأسطى محمد حسن بنجاح.', time: 'منذ 5 دقائق', type: 'booking', isRead: false },
  { id: 'n2', title: 'تحديث حالة الخدمة', message: 'الصنايعي في الطريق إليك الآن.', time: 'منذ ساعة', type: 'status', isRead: true },
  { id: 'n3', title: 'عرض خاص!', message: 'خصم 20% على خدمات السباكة هذا الأسبوع.', time: 'منذ يوم', type: 'offer', isRead: true },
];

const MOCK_PROMOTIONS: Promotion[] = [
  { id: 'p1', title: 'عرض الصيف', description: 'خصم على صيانة التكييات', discount: '25%', code: 'SUMMER25', image: 'https://picsum.photos/seed/promo1/600/300', color: 'bg-blue-600' },
  { id: 'p2', title: 'أول حجز؟', description: 'خصم خاص لمستخدمينا الجدد', discount: '50 ج.م', code: 'WELCOME50', image: 'https://picsum.photos/seed/promo2/600/300', color: 'bg-purple-600' },
];

const MOCK_UPCOMING: UpcomingService[] = [
  {
    id: 'u1',
    providerName: 'الأسطى محمد حسن',
    providerImage: 'https://picsum.photos/seed/p1/400/400',
    serviceName: 'صيانة سخان',
    date: '28 مارس 2026',
    time: '10:00 صباحاً',
    reminderTime: 'قبل ساعة واحدة'
  }
];

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  participantName: string;
  participantImage: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

export default function SanayiyaServices({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<'home' | 'list' | 'profile' | 'booking' | 'checkout' | 'tracking' | 'history' | 'rating' | 'notifications' | 'success' | 'portfolio' | 'filters' | 'map' | 'reminders' | 'onboarding' | 'pro-dashboard' | 'chat'>('home');
  const [userRole, setUserRole] = useState<'user' | 'pro'>('user');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    category: '',
    experience: '',
    pricePerHour: '',
    description: '',
    portfolio: [] as string[],
    idImage: null as string | null,
  });
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: [0, 1000],
    minRating: 0,
    location: 'all'
  });
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    date: '',
    time: '',
    notes: '',
    addressId: 'a1',
    paymentMethod: 'cash'
  });

  const [trackingStatus, setTrackingStatus] = useState<'confirmed' | 'on_way' | 'in_progress' | 'completed'>('confirmed');
  const [ratingData, setRatingData] = useState({ rating: 0, comment: '' });

  // Navigation Handlers
  const goToHome = () => setView('home');
  const goToList = (catId: string | null) => {
    setSelectedCategory(catId);
    setView('list');
  };
  const goToProfile = (provider: Provider) => {
    setSelectedProvider(provider);
    setView('profile');
  };
  const goToBooking = (provider: Provider) => {
    setSelectedProvider(provider);
    setView('booking');
  };
  const goToCheckout = () => setView('checkout');
  const goToTracking = () => setView('tracking');
  const goToHistory = () => setView('history');
  const goToRating = () => setView('rating');
  const goToNotifications = () => setView('notifications');
  const goToSuccess = () => setView('success');
  const goToPortfolio = (provider: Provider, projectIndex: number) => {
    setSelectedProvider(provider);
    setSelectedProject(provider.portfolio[projectIndex]);
    setView('portfolio');
  };
  const goToFilters = () => setView('filters');
  const goToMap = () => setView('map');
  const goToReminders = () => setView('reminders');
  const goToOnboarding = () => setView('onboarding');
  const goToProDashboard = () => {
    setUserRole('pro');
    setView('pro-dashboard');
  };
  const goToChat = (chat: Chat) => {
    setSelectedChat(chat);
    setView('chat');
  };
  const startNewChat = (provider: Provider) => {
    const newChat: Chat = {
      id: `c_${provider.id}`,
      participantName: provider.name,
      participantImage: provider.image,
      lastMessage: '',
      time: 'الآن',
      unreadCount: 0,
      messages: []
    };
    setSelectedChat(newChat);
    setView('chat');
  };

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-8 pb-24">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <div className="flex flex-col">
            <span className="text-royal-600 font-black text-xl tracking-tighter">كفراوي</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">خدمات الصنايعية</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={goToReminders}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl"
          >
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button 
            onClick={goToHistory}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl"
          >
            <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button 
            onClick={goToNotifications}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl relative"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800" />
          </button>
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-royal-100">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6">
        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-royal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="ابحث عن سباك، كهربائي، أو نجار..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-royal-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] py-4 pr-12 pl-4 text-sm font-bold transition-all shadow-sm"
          />
          <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-royal-600 text-white rounded-2xl shadow-lg shadow-royal-600/20">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Promotions Carousel */}
      <section className="px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {MOCK_PROMOTIONS.map((promo) => (
            <div 
              key={promo.id}
              className={`min-w-[300px] h-40 ${promo.color} rounded-[32px] p-6 relative overflow-hidden flex flex-col justify-center text-white shadow-xl shadow-${promo.color.split('-')[1]}-500/20`}
            >
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" 
              />
              <div className="relative z-10 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{promo.title}</div>
                <h3 className="text-xl font-black">{promo.description}</h3>
                <div className="flex items-center gap-3 pt-2">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black">
                    كود: {promo.code}
                  </div>
                  <button className="bg-white text-slate-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                    تطبيق العرض
                  </button>
                </div>
              </div>
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">التصنيفات</h2>
          <button onClick={() => goToList(null)} className="text-royal-600 text-xs font-bold">عرض الكل</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToList(cat.id)}
              className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-[28px] shadow-sm border border-slate-50 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all"
            >
              <div className={`w-14 h-14 ${cat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-${cat.color.split('-')[1]}-500/20`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Professionals Carousel */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">أفضل الصنايعية</h2>
          <button onClick={() => goToList(null)} className="text-royal-600 text-xs font-bold flex items-center gap-1">
            المزيد <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {MOCK_PROVIDERS.map((p) => (
            <motion.div
              key={p.id}
              onClick={() => goToProfile(p)}
              className="min-w-[280px] bg-white dark:bg-slate-800 rounded-[32px] p-4 shadow-sm border border-slate-50 dark:border-slate-700 cursor-pointer"
            >
              <div className="relative mb-4">
                <img src={p.image} alt={p.name} className="w-full h-40 rounded-[24px] object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-black text-slate-900">{p.rating}</span>
                </div>
                {p.isVerified && (
                  <div className="absolute top-3 right-3 bg-royal-600 text-white p-1.5 rounded-xl shadow-lg shadow-royal-600/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 font-bold">{CATEGORIES.find(c => c.id === p.category)?.name}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <span className="text-sm font-black">{p.pricePerHour}</span>
                    <span className="text-[10px] font-bold">ج.م / ساعة</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{p.worksDone} عمل منجز</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Become a Pro CTA */}
      <section className="px-6">
        <div className="bg-slate-900 dark:bg-royal-900/20 rounded-[40px] p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-royal-600 rounded-2xl flex items-center justify-center text-white">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">هل أنت صنايعي محترف؟</h2>
            <p className="text-slate-400 text-sm font-bold leading-relaxed">
              انضم إلى آلاف المحترفين في كفر الشيخ وابدأ في استقبال طلبات العملاء وزيادة دخلك اليوم.
            </p>
            <button 
              onClick={goToOnboarding}
              className="bg-white text-slate-900 px-8 py-4 rounded-[24px] font-black text-sm shadow-xl shadow-white/10 flex items-center gap-3"
            >
              سجل كصنايعي الآن <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-royal-600/20 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );

  const ListView = () => {
    const filtered = selectedCategory 
      ? MOCK_PROVIDERS.filter(p => p.category === selectedCategory)
      : MOCK_PROVIDERS;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'كل الصنايعية'}
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={goToFilters}
              className="p-3 bg-royal-600 text-white rounded-2xl shadow-lg shadow-royal-600/20"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو التخصص..." 
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-3 pr-10 pl-4 text-xs font-bold"
              />
            </div>
            <button 
              onClick={goToMap}
              className="p-3 bg-royal-600 text-white rounded-2xl shadow-lg shadow-royal-600/20"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="px-6 py-8 space-y-6">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => goToProfile(p)}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border border-slate-50 dark:border-slate-800 flex gap-5 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-24 h-24 rounded-[24px] object-cover" />
                {p.isAvailable && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 dark:text-white">{p.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">{p.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-bold">{CATEGORIES.find(c => c.id === p.category)?.name}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold">السعر</span>
                    <span className="text-sm font-black text-emerald-600">{p.pricePerHour} ج.م</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold">الأعمال</span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">{p.worksDone}</span>
                  </div>
                </div>
                <button className="w-full mt-2 py-2 bg-slate-50 dark:bg-slate-800 text-royal-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  عرض الملف الشخصي
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const ProfileView = () => {
    const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews'>('services');
    if (!selectedProvider) return null;

    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pb-32">
        {/* Header */}
        <div className="relative h-80">
          <img src={selectedProvider.image} alt={selectedProvider.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-black/20" />
          <button 
            onClick={() => setView('list')}
            className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white">{selectedProvider.name}</h1>
                  {selectedProvider.isVerified && <ShieldCheck className="w-6 h-6 text-royal-500" />}
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-royal-100 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 rounded-lg text-xs font-black">
                    {CATEGORIES.find(c => c.id === selectedProvider.category)?.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{selectedProvider.rating}</span>
                    <span className="text-xs text-slate-400 font-bold">({selectedProvider.reviewsCount} تقييم)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl">
                <span className="text-2xl font-black text-royal-600">{selectedProvider.experience}</span>
                <span className="text-[10px] text-slate-400 font-bold">سنوات خبرة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-8">
          <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-[24px]">
            {[
              { id: 'services', label: 'الخدمات', icon: <Wrench className="w-4 h-4" /> },
              { id: 'portfolio', label: 'الأعمال', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'reviews', label: 'التقييمات', icon: <Star className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-xs font-black transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-royal-600 shadow-sm' 
                  : 'text-slate-400'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'services' && (
              <motion.div 
                key="services"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {selectedProvider.services.map((service) => (
                  <div key={service.id} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] flex items-center justify-between border border-transparent hover:border-royal-500/20 transition-all">
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 dark:text-white">{service.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <Clock className="w-3 h-3" /> {service.duration}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-emerald-600 font-black">{service.price} ج.م</div>
                      <button 
                        onClick={() => {
                          setBookingData(prev => ({ ...prev, serviceId: service.id }));
                          goToBooking(selectedProvider);
                        }}
                        className="text-[10px] font-black text-royal-600 uppercase tracking-widest mt-1"
                      >
                        حجز الآن
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div 
                key="portfolio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {selectedProvider.portfolio.map((project, i) => (
                  <div 
                    key={i} 
                    onClick={() => goToPortfolio(selectedProvider, i)}
                    className="aspect-square rounded-[24px] overflow-hidden group relative cursor-pointer"
                  >
                    <img src={project.after} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {selectedProvider.reviews.length > 0 ? (
                  selectedProvider.reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={review.userImage} alt={review.userName} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{review.userName}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm font-bold">لا توجد تقييمات بعد</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <button 
              onClick={() => startNewChat(selectedProvider)}
              className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[24px]"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <button 
              onClick={() => goToBooking(selectedProvider)}
              className="flex-1 bg-royal-600 hover:bg-royal-700 text-white py-4 rounded-[24px] font-black shadow-xl shadow-royal-600/20 transition-all"
            >
              حجز موعد الآن
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BookingView = () => {
    if (!selectedProvider) return null;
    const selectedService = selectedProvider.services.find(s => s.id === bookingData.serviceId) || selectedProvider.services[0];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('profile')} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">تأكيد الحجز</h1>
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Service Summary */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center gap-4">
            <img src={selectedProvider.image} alt={selectedProvider.name} className="w-16 h-16 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-black text-slate-900 dark:text-white">{selectedProvider.name}</h3>
              <p className="text-xs text-royal-600 font-bold">{selectedService.name}</p>
            </div>
            <div className="text-emerald-600 font-black">{selectedService.price} ج.م</div>
          </div>

          {/* Date & Time Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-royal-600" /> موعد الخدمة
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mr-2">التاريخ</label>
                <input 
                  type="date" 
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest mr-2">الوقت</label>
                <input 
                  type="time" 
                  value={bookingData.time}
                  onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-royal-600" /> ملاحظات إضافية
            </h2>
            <textarea 
              placeholder="اكتب أي تفاصيل إضافية عن المشكلة أو الطلب هنا..."
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-[28px] p-5 text-sm font-bold shadow-sm resize-none"
            />
          </div>

          {/* Price Breakdown */}
          <div className="bg-royal-600 rounded-[32px] p-6 text-white shadow-xl shadow-royal-600/20 space-y-4">
            <div className="flex justify-between text-sm font-bold opacity-80">
              <span>سعر الخدمة الأساسي</span>
              <span>{selectedService.price} ج.م</span>
            </div>
            <div className="flex justify-between text-sm font-bold opacity-80">
              <span>رسوم الانتقال</span>
              <span>20 ج.م</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between text-xl font-black">
              <span>الإجمالي</span>
              <span>{selectedService.price + 20} ج.م</span>
            </div>
          </div>

          <button 
            onClick={goToCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[28px] font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
          >
            <ArrowRight className="w-6 h-6 rotate-180" /> الاستمرار للدفع
          </button>
        </div>
      </div>
    );
  };

  const CheckoutView = () => {
    if (!selectedProvider) return null;
    const selectedService = selectedProvider.services.find(s => s.id === bookingData.serviceId) || selectedProvider.services[0];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('booking')} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">الدفع</h1>
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Address Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-royal-600" /> عنوان الخدمة
            </h2>
            <div className="space-y-3">
              {MOCK_ADDRESSES.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setBookingData(prev => ({ ...prev, addressId: addr.id }))}
                  className={`w-full p-5 rounded-[28px] text-right transition-all border-2 ${
                    bookingData.addressId === addr.id 
                    ? 'bg-white dark:bg-slate-900 border-royal-500/20 shadow-md' 
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-slate-900 dark:text-white">{addr.label}</span>
                    {bookingData.addressId === addr.id && <CheckCircle2 className="w-5 h-5 text-royal-600" />}
                  </div>
                  <p className="text-xs text-slate-400 font-bold">{addr.address}</p>
                </button>
              ))}
              <button className="w-full p-4 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-black flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> إضافة عنوان جديد
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-royal-600" /> طريقة الدفع
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'بطاقة', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'wallet', label: 'محفظة', icon: <Wallet className="w-5 h-5" /> },
                { id: 'cash', label: 'كاش', icon: <Banknote className="w-5 h-5" /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method.id }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[24px] transition-all border-2 ${
                    bookingData.paymentMethod === method.id 
                    ? 'bg-white dark:bg-slate-900 border-royal-500/20 shadow-md text-royal-600' 
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
                  }`}
                >
                  {method.icon}
                  <span className="text-[10px] font-black">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white mb-2">ملخص الطلب</h3>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>{selectedService.name}</span>
              <span>{selectedService.price} ج.م</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>رسوم الانتقال</span>
              <span>20 ج.م</span>
            </div>
            <div className="h-px bg-slate-50 dark:bg-slate-800" />
            <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white">
              <span>الإجمالي</span>
              <span>{selectedService.price + 20} ج.م</span>
            </div>
          </div>

          <button 
            onClick={goToSuccess}
            className="w-full bg-royal-600 hover:bg-royal-700 text-white py-5 rounded-[28px] font-black shadow-xl shadow-royal-600/20 transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-6 h-6" /> تأكيد وطلب الخدمة
          </button>
        </div>
      </div>
    );
  };

  const SuccessView = () => (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6 text-center space-y-8">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-[48px] flex items-center justify-center shadow-2xl shadow-emerald-500/20"
      >
        <CheckCircle2 className="w-16 h-16" />
      </motion.div>
      
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">تم طلب الخدمة بنجاح!</h1>
        <p className="text-sm text-slate-400 font-bold max-w-[280px] mx-auto leading-relaxed">
          لقد تم استلام طلبك بنجاح. سيقوم الأسطى بالتواصل معك في أقرب وقت ممكن.
        </p>
      </div>

      <div className="w-full space-y-4 pt-8">
        <button 
          onClick={goToTracking}
          className="w-full bg-royal-600 text-white py-5 rounded-[28px] font-black shadow-xl shadow-royal-600/20 transition-all flex items-center justify-center gap-3"
        >
          <MapPin className="w-5 h-5" /> تتبع حالة الخدمة
        </button>
        <button 
          onClick={goToHome}
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-5 rounded-[28px] font-black transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  const TrackingView = () => {
    if (!selectedProvider) return null;
    const selectedService = selectedProvider.services.find(s => s.id === bookingData.serviceId) || selectedProvider.services[0];
    const steps = [
      { id: 'confirmed', label: 'تم تأكيد الحجز', icon: <CheckCircle2 className="w-5 h-5" /> },
      { id: 'on_way', label: 'في الطريق إليك', icon: <Truck className="w-5 h-5" /> },
      { id: 'in_progress', label: 'جاري العمل', icon: <Wrench className="w-5 h-5" /> },
      { id: 'completed', label: 'تم الانتهاء', icon: <Award className="w-5 h-5" /> },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === trackingStatus);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">تفاصيل الخدمة الحالية</h1>
            <button 
              onClick={goToMap}
              className="text-royal-600 text-xs font-black flex items-center gap-1.5 bg-royal-50 dark:bg-royal-900/20 px-4 py-2 rounded-xl"
            >
              <MapPin className="w-4 h-4" />
              عرض الخريطة
            </button>
          </div>
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Map Preview */}
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[40px] relative overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl">
            <Map className="w-12 h-12 text-slate-400 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl text-[10px] font-black text-royal-600 shadow-sm">
              معاينة الخريطة
            </div>
          </div>

          {/* Service Info Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedProvider.image} alt={selectedProvider.name} className="w-14 h-14 rounded-2xl object-cover" />
              <div className="flex-1">
                <h3 className="font-black text-slate-900 dark:text-white">{selectedProvider.name}</h3>
                <p className="text-xs text-slate-400 font-bold">{CATEGORIES.find(c => c.id === selectedProvider.category)?.name}</p>
              </div>
              <button className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                <Phone className="w-5 h-5" />
              </button>
            </div>

            <div className="h-px bg-slate-50 dark:bg-slate-800" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الخدمة المطلوبة</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{selectedService.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">التكلفة الإجمالية</div>
                <div className="text-sm font-black text-emerald-600">{selectedService.price + 20} ج.م</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">العنوان</div>
                <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {MOCK_ADDRESSES.find(a => a.id === bookingData.addressId)?.address}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">الوقت المتوقع</div>
                <div className="text-sm font-black text-royal-600">15 - 20 دقيقة</div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="space-y-8 relative">
              <div className="absolute right-2.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.id} className="flex items-center gap-6 relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-royal-600 text-white shadow-lg shadow-royal-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-black ${isCurrent ? 'text-royal-600' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                        {step.label}
                      </div>
                    </div>
                    {isCurrent && <div className="p-2 bg-royal-50 dark:bg-royal-900/20 rounded-lg text-royal-600">{step.icon}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-4 rounded-[24px] text-slate-600 dark:text-slate-400 font-black text-sm flex items-center justify-center gap-2 shadow-sm">
              <MessageSquare className="w-5 h-5" /> مراسلة الصنايعي
            </button>
            <button 
              onClick={() => {
                if (trackingStatus === 'confirmed') setTrackingStatus('on_way');
                else if (trackingStatus === 'on_way') setTrackingStatus('in_progress');
                else if (trackingStatus === 'in_progress') setTrackingStatus('completed');
                else goToRating();
              }}
              className="flex-1 bg-royal-600 text-white py-4 rounded-[24px] font-black text-sm shadow-xl shadow-royal-600/20"
            >
              {trackingStatus === 'completed' ? 'تقييم الخدمة' : 'تحديث الحالة'}
            </button>
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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">سجل الخدمات</h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {MOCK_HISTORY.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border border-slate-50 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={item.providerImage} alt={item.providerName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{item.providerName}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{item.date}</div>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black">
                مكتملة
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400">الخدمة</div>
                <div className="text-sm font-black text-slate-700 dark:text-slate-300">{item.serviceName}</div>
              </div>
              <div className="text-left space-y-1">
                <div className="text-xs font-bold text-slate-400">السعر</div>
                <div className="text-sm font-black text-royal-600">{item.price} ج.م</div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black">
                عرض التفاصيل
              </button>
              <button className="flex-1 py-3 bg-royal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-royal-600/20">
                إعادة حجز
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RatingView = () => {
    if (!selectedProvider) return null;

    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
        <header className="px-6 py-6 flex items-center justify-between">
          <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <X className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h1 className="text-lg font-black text-slate-900 dark:text-white">تقييم الخدمة</h1>
          <div className="w-11" />
        </header>

        <div className="px-6 py-12 flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-royal-100 shadow-2xl">
              <img src={selectedProvider.image} alt={selectedProvider.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white p-2 rounded-2xl shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">كيف كانت تجربتك مع {selectedProvider.name}؟</h2>
            <p className="text-sm text-slate-400 font-bold">رأيك يساعدنا في تحسين جودة الخدمات</p>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRatingData(prev => ({ ...prev, rating: star }))}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= ratingData.rating 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-slate-200'
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="w-full space-y-4">
            <textarea 
              placeholder="اكتب تعليقك هنا (اختياري)..."
              value={ratingData.comment}
              onChange={(e) => setRatingData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-[32px] p-6 text-sm font-bold shadow-sm resize-none"
            />
          </div>

          <button 
            onClick={() => {
              alert('شكراً لتقييمك!');
              goToHome();
            }}
            className="w-full bg-royal-600 hover:bg-royal-700 text-white py-5 rounded-[28px] font-black shadow-xl shadow-royal-600/20 transition-all flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5" /> إرسال التقييم
          </button>
        </div>
      </div>
    );
  };

  const PortfolioGalleryView = () => {
    if (!selectedProvider) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pb-24 min-h-screen bg-white dark:bg-slate-950"
      >
        <div className="px-6 pt-8 pb-4 flex items-center gap-4 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={() => setView('profile')} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">معرض أعمال {selectedProvider.name}</h2>
        </div>

        <div className="px-6 space-y-10 mt-6">
          {selectedProvider.portfolio.map((project) => (
            <div key={project.id} className="space-y-4">
              <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">{project.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative border-2 border-slate-100 dark:border-slate-800">
                    <img src={project.before} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-black">قبل</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative border-2 border-royal-500/20 shadow-lg">
                    <img src={project.after} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 right-3 bg-royal-600 text-white text-[10px] px-3 py-1 rounded-full shadow-lg font-black">بعد</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const FilterView = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 overflow-y-auto"
      >
        <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <button onClick={() => goToList(null)} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <X className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">فلترة البحث</h2>
          <button 
            onClick={() => setFilters({ type: 'all', priceRange: [0, 1000], minRating: 0, location: 'all' })}
            className="text-royal-600 text-sm font-black"
          >
            إعادة تعيين
          </button>
        </div>

        <div className="p-6 space-y-10 pb-32">
          {/* Service Type */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white">نوع الخدمة</h3>
            <div className="flex flex-wrap gap-3">
              {['الكل', 'سباكة', 'كهرباء', 'نجارة', 'نقاشة'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilters({ ...filters, type: t })}
                  className={`px-6 py-3 rounded-[20px] text-xs font-black transition-all ${
                    filters.type === t 
                      ? 'bg-royal-600 text-white shadow-xl shadow-royal-600/20' 
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white">نطاق السعر (ساعة)</h3>
            <div className="px-2">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-royal-600"
              />
              <div className="flex justify-between mt-3 text-xs font-bold text-slate-400">
                <span>0 ج.م</span>
                <span className="text-royal-600">{filters.priceRange[1]} ج.م</span>
              </div>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white">التقييم الأدنى</h3>
            <div className="flex gap-3">
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters({ ...filters, minRating: r })}
                  className={`flex-1 py-4 rounded-[24px] border-2 transition-all flex items-center justify-center gap-1.5 ${
                    filters.minRating === r
                      ? 'border-royal-600 bg-royal-50 dark:bg-royal-900/20 text-royal-600'
                      : 'border-slate-50 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${filters.minRating === r ? 'fill-royal-600' : ''}`} />
                  <span className="font-black">{r}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white">الموقع</h3>
            <div className="relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select 
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-900 rounded-[24px] border-none focus:ring-2 focus:ring-royal-600 text-sm font-bold text-slate-900 dark:text-white appearance-none"
              >
                <option value="all">كل المناطق</option>
                <option value="maadi">المعادي</option>
                <option value="nasr-city">مدينة نصر</option>
                <option value="tagamoa">التجمع الخامس</option>
                <option value="dokki">الدقي</option>
              </select>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-20">
          <button 
            onClick={() => goToList(null)}
            className="w-full py-5 bg-royal-600 text-white rounded-[28px] font-black shadow-xl shadow-royal-600/20"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </motion.div>
    );
  };

  const MapView = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-950"
      >
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
          {/* User Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-16 h-16 bg-royal-600/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-16 h-16 bg-royal-600 rounded-[28px] flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl relative z-10">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Provider Pin */}
          <div className="absolute top-1/3 right-1/4">
            <div className="relative">
              <div className="w-14 h-14 bg-emerald-600 rounded-[24px] flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-xl whitespace-nowrap border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white">الأسطى محمد (على بعد 2 كم)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Overlay */}
        <div className="absolute top-8 left-6 right-6 flex items-center gap-4">
          <button onClick={() => setView('tracking')} className="p-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-[24px] shadow-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن موقع..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
            />
          </div>
        </div>

        {/* Bottom Card */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] shadow-2xl space-y-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img 
                src="https://picsum.photos/seed/p1/400/400" 
                className="w-20 h-20 rounded-[28px] object-cover border-2 border-slate-50 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="font-black text-slate-900 dark:text-white text-lg">الأسطى محمد حسن</h3>
                <p className="text-sm text-slate-400 font-bold">في الطريق إليك • 5 دقائق متبقية</p>
              </div>
              <button className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[24px]">
                <Phone className="w-6 h-6" />
              </button>
            </div>
            <button 
              onClick={() => setView('tracking')}
              className="w-full py-5 bg-royal-600 text-white rounded-[28px] font-black shadow-xl shadow-royal-600/20"
            >
              العودة للتتبع
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const RemindersView = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pb-24 min-h-screen bg-slate-50 dark:bg-slate-950"
      >
        <div className="px-6 pt-8 pb-4 flex items-center gap-4 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">تذكيرات الخدمات</h2>
        </div>

        <div className="px-6 mt-8 space-y-6">
          {MOCK_UPCOMING.map((service) => (
            <div key={service.id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-royal-50 dark:bg-royal-900/20 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-royal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 dark:text-white text-lg">{service.serviceName}</h3>
                  <p className="text-sm text-slate-400 font-bold">{service.providerName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-[24px] flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-royal-600" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{service.date}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-[24px] flex items-center gap-3">
                  <Clock className="w-5 h-5 text-royal-600" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">{service.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-bold">التذكير: {service.reminderTime}</span>
                </div>
                <button className="text-royal-600 text-sm font-black bg-royal-50 dark:bg-royal-900/20 px-4 py-2 rounded-xl">تعديل</button>
              </div>
            </div>
          ))}

          {MOCK_UPCOMING.length === 0 && (
            <div className="py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">لا توجد خدمات قادمة حالياً</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const OnboardingView = () => {
    const steps = [
      { id: 1, title: 'المعلومات الأساسية' },
      { id: 2, title: 'تفاصيل الخدمة' },
      { id: 3, title: 'معرض الأعمال' },
      { id: 4, title: 'التوثيق' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">انضم كصنايعي</h1>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step.id <= onboardingStep ? 'bg-royal-600' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{steps[onboardingStep - 1].title}</h2>
            <p className="text-sm text-slate-400 font-bold">أكمل البيانات التالية لإنشاء ملفك الشخصي</p>
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
                  <input 
                    type="text" 
                    placeholder="مثال: محمد حسن"
                    value={onboardingData.name}
                    onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">التخصص</label>
                  <select 
                    value={onboardingData.category}
                    onChange={(e) => setOnboardingData({...onboardingData, category: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm appearance-none"
                  >
                    <option value="">اختر التخصص</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">سنوات الخبرة</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 5"
                    value={onboardingData.experience}
                    onChange={(e) => setOnboardingData({...onboardingData, experience: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm"
                  />
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
                  <label className="text-xs font-black text-slate-400 mr-2">سعر الساعة (ج.م)</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 150"
                    value={onboardingData.pricePerHour}
                    onChange={(e) => setOnboardingData({...onboardingData, pricePerHour: e.target.value})}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">نبذة عنك</label>
                  <textarea 
                    placeholder="اكتب وصفاً مختصراً لخبراتك ومهاراتك..."
                    value={onboardingData.description}
                    onChange={(e) => setOnboardingData({...onboardingData, description: e.target.value})}
                    rows={5}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-[28px] p-5 text-sm font-bold shadow-sm resize-none"
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  {onboardingData.portfolio.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setOnboardingData({...onboardingData, portfolio: onboardingData.portfolio.filter((_, idx) => idx !== i)})}
                        className="absolute top-2 left-2 p-1 bg-rose-500 text-white rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setOnboardingData({...onboardingData, portfolio: [...onboardingData.portfolio, `https://picsum.photos/seed/${Math.random()}/400/400` ]})}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[10px] font-black">إضافة صورة</span>
                  </button>
                </div>
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
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                    يرجى رفع صورة واضحة لبطاقة الرقم القومي لتوثيق حسابك. لن تظهر هذه الصورة للعملاء.
                  </p>
                </div>
                <button 
                  onClick={() => setOnboardingData({...onboardingData, idImage: 'uploaded'})}
                  className={`w-full aspect-video rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all ${
                    onboardingData.idImage ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {onboardingData.idImage ? (
                    <>
                      <CheckCircle2 className="w-12 h-12" />
                      <span className="font-black">تم رفع البطاقة بنجاح</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-12 h-12" />
                      <span className="font-black">رفع صورة البطاقة</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-8">
            {onboardingStep > 1 && (
              <button 
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black"
              >
                السابق
              </button>
            )}
            <button 
              onClick={() => {
                if (onboardingStep < 4) setOnboardingStep(onboardingStep + 1);
                else goToProDashboard();
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

  const ProDashboardView = () => {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-royal-100">
                <img src="https://picsum.photos/seed/pro/100/100" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">لوحة التحكم</h1>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  متصل الآن
                </div>
              </div>
            </div>
            <button onClick={() => { setUserRole('user'); goToHome(); }} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <User className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">45</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">عمل مكتمل</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">3.2k</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الأرباح (ج.م)</div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">طلبات جديدة</h2>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">2</span>
            </div>
            <div className="space-y-4">
              {[
                { id: 'b1', user: 'أحمد علي', service: 'تصليح سباكة', time: 'اليوم، 04:00 م', price: 150 },
                { id: 'b2', user: 'سارة محمود', service: 'تركيب طقم حمام', time: 'غداً، 10:00 ص', price: 800 },
              ].map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">{booking.user}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{booking.service}</div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-black text-sm">{booking.price} ج.م</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                    <Clock className="w-3 h-3" /> {booking.time}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black">رفض</button>
                    <button className="flex-1 py-3 bg-royal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-royal-600/20">قبول</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">الرسائل الأخيرة</h2>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-50 dark:border-slate-800">
              {[
                { id: 'm1', user: 'أحمد علي', msg: 'هل يمكنك المجيء مبكراً؟', time: '10:30 ص' },
                { id: 'm2', user: 'محمود حسن', msg: 'تم إرسال الموقع', time: 'أمس' },
              ].map((m, i) => (
                <div key={m.id} className={`p-4 flex items-center gap-4 ${i !== 0 ? 'border-t border-slate-50 dark:border-slate-800' : ''}`}>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{m.user}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{m.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold truncate">{m.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button className="p-3 text-royal-600"><Zap className="w-6 h-6" /></button>
            <button className="p-3 text-slate-400"><Calendar className="w-6 h-6" /></button>
            <button className="p-3 text-slate-400"><MessageSquare className="w-6 h-6" /></button>
            <button className="p-3 text-slate-400"><User className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
    );
  };

  const ChatView = () => {
    if (!selectedChat) return null;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('profile')} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={selectedChat.participantImage} className="w-12 h-12 rounded-2xl object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <h1 className="text-sm font-black text-slate-900 dark:text-white">{selectedChat.participantName}</h1>
                  <span className="text-[10px] text-emerald-600 font-bold">نشط الآن</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full uppercase tracking-widest">اليوم</span>
          </div>

          {/* Received Message */}
          <div className="flex gap-3 max-w-[80%]">
            <img src={selectedChat.participantImage} className="w-8 h-8 rounded-lg object-cover self-end" />
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] rounded-br-none shadow-sm border border-slate-50 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                أهلاً بك! كيف يمكنني مساعدتك اليوم؟
              </p>
              <span className="text-[8px] text-slate-400 font-bold mt-2 block">10:00 ص</span>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex flex-row-reverse gap-3 max-w-[80%] mr-auto">
            <div className="bg-royal-600 p-4 rounded-[24px] rounded-bl-none shadow-xl shadow-royal-600/20 text-white">
              <p className="text-xs font-bold leading-relaxed">
                أريد صيانة لسخان الغاز، هل أنت متاح اليوم؟
              </p>
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[8px] opacity-70 font-bold">10:05 ص</span>
                <CheckCircle2 className="w-2 h-2 opacity-70" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl">
              <Plus className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="اكتب رسالتك هنا..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-[24px] py-4 pr-6 pl-12 text-sm font-bold transition-all"
              />
              <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-royal-600 text-white rounded-xl shadow-lg shadow-royal-600/20">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

      <div className="px-6 py-8 space-y-4">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-5 rounded-[32px] border transition-all flex gap-4 ${
              notif.isRead 
              ? 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800' 
              : 'bg-royal-50/50 dark:bg-royal-900/10 border-royal-100 dark:border-royal-900/30 shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              notif.type === 'booking' ? 'bg-emerald-100 text-emerald-600' :
              notif.type === 'status' ? 'bg-blue-100 text-blue-600' :
              'bg-amber-100 text-amber-600'
            }`}>
              {notif.type === 'booking' ? <CheckCircle2 className="w-6 h-6" /> :
               notif.type === 'status' ? <Truck className="w-6 h-6" /> :
               <Zap className="w-6 h-6" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{notif.title}</h3>
                {!notif.isRead && <div className="w-2 h-2 bg-royal-600 rounded-full" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {notif.message}
              </p>
              <div className="text-[10px] text-slate-400 font-bold pt-1">{notif.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans" dir="rtl">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeView />
          </motion.div>
        )}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ListView />
          </motion.div>
        )}
        {view === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileView />
          </motion.div>
        )}
        {view === 'booking' && (
          <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BookingView />
          </motion.div>
        )}
        {view === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CheckoutView />
          </motion.div>
        )}
        {view === 'tracking' && (
          <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TrackingView />
          </motion.div>
        )}
        {view === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HistoryView />
          </motion.div>
        )}
        {view === 'rating' && (
          <motion.div key="rating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RatingView />
          </motion.div>
        )}
        {view === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NotificationsView />
          </motion.div>
        )}
        {view === 'success' && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SuccessView />
          </motion.div>
        )}
        {view === 'portfolio' && (
          <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PortfolioGalleryView />
          </motion.div>
        )}
        {view === 'filters' && (
          <motion.div key="filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FilterView />
          </motion.div>
        )}
        {view === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MapView />
          </motion.div>
        )}
        {view === 'reminders' && (
          <motion.div key="reminders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RemindersView />
          </motion.div>
        )}
        {view === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingView />
          </motion.div>
        )}
        {view === 'pro-dashboard' && (
          <motion.div key="pro-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProDashboardView />
          </motion.div>
        )}
        {view === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChatView />
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .font-sans {
          font-family: 'Cairo', sans-serif;
        }
      `}} />
    </div>
  );
}
