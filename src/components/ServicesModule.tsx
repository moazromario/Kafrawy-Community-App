import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  ChevronLeft, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  History, 
  Tag, 
  Filter, 
  LayoutGrid, 
  List, 
  Camera, 
  ArrowRight,
  Plus,
  Trash2,
  Navigation,
  Info,
  ThumbsUp,
  Award,
  Briefcase,
  Wrench,
  Droplets,
  Zap,
  Paintbrush,
  Truck,
  Hammer,
  GraduationCap
} from 'lucide-react';
import { 
  ServiceProvider, 
  ServiceCategory, 
  ServiceItem, 
  Booking, 
  PromoBanner 
} from '../types';
import TeachersScreen from './TeachersScreen';

// --- Mock Data for Services ---

const CATEGORIES: ServiceCategory[] = [
  { id: 'elec', name: 'كهرباء', icon: <Zap className="w-6 h-6" /> },
  { id: 'plumb', name: 'سباكة', icon: <Droplets className="w-6 h-6" /> },
  { id: 'paint', name: 'دهان', icon: <Paintbrush className="w-6 h-6" /> },
  { id: 'general', name: 'صيانة عامة', icon: <Hammer className="w-6 h-6" /> },
  { id: 'move', name: 'نقل أثاث', icon: <Truck className="w-6 h-6" /> },
  { id: 'teachers', name: 'مدرسين', icon: <GraduationCap className="w-6 h-6" /> },
];

const PROVIDERS: ServiceProvider[] = [
  { 
    id: 'p1', 
    name: 'المهندس أحمد محمود', 
    category: 'كهربائي منازل', 
    rating: 4.9, 
    reviews: 124,
    experience: 8,
    completedWorks: 450,
    image: 'https://picsum.photos/seed/p1/200/200', 
    isAvailable: true,
    priceStart: '100 ج.م',
    bio: 'متخصص في جميع أعمال الكهرباء المنزلية والتركيبات الحديثة. خبرة 8 سنوات في كفر الدوار.',
    gallery: [
      'https://picsum.photos/seed/g1/400/300',
      'https://picsum.photos/seed/g2/400/300',
      'https://picsum.photos/seed/g3/400/300',
      'https://picsum.photos/seed/g4/400/300',
    ],
    services: [
      { id: 's1', name: 'تركيب نجف وإضاءة', price: 150, description: 'تركيب جميع أنواع النجف والسبوتات' },
      { id: 's2', name: 'تأسيس شقة كاملة', price: 2500, description: 'تأسيس كامل للكهرباء من الصفر' },
      { id: 's3', name: 'صيانة أعطال مفاجئة', price: 100, description: 'إصلاح أي عطل كهربائي طارئ' },
    ]
  },
  { 
    id: 'p2', 
    name: 'كابتن محمود ياسين', 
    category: 'نقل أثاث', 
    rating: 4.7, 
    reviews: 89,
    experience: 5,
    completedWorks: 320,
    image: 'https://picsum.photos/seed/p2/200/200', 
    isAvailable: true,
    priceStart: '200 ج.م',
    bio: 'نقل أثاث بفك وتركيب وتغليف. أمان وسرعة في التنفيذ.',
    gallery: [
      'https://picsum.photos/seed/g5/400/300',
      'https://picsum.photos/seed/g6/400/300',
    ],
    services: [
      { id: 's4', name: 'نقل غرفة واحدة', price: 300, description: 'نقل وتغليف غرفة كاملة' },
      { id: 's5', name: 'نقل شقة كاملة', price: 1500, description: 'نقل جميع محتويات الشقة' },
    ]
  },
];

const OFFERS: PromoBanner[] = [
  { id: 'o1', title: 'خصم 20% على السباكة', subtitle: 'لفترة محدودة فقط', image: 'https://picsum.photos/seed/o1/800/400', cta: 'احجز الآن', accentColor: '#1877F2' },
  { id: 'o2', title: 'فحص كهرباء مجاني', subtitle: 'عند طلب أي خدمة تأسيس', image: 'https://picsum.photos/seed/o2/800/400', cta: 'اطلب العرض', accentColor: '#F27D26' },
];

const BOOKINGS: Booking[] = [
  { 
    id: 'b1', 
    serviceId: 's1', 
    providerId: 'p1', 
    providerName: 'المهندس أحمد محمود', 
    date: '2026-03-25', 
    time: '10:00 ص', 
    status: 'confirmed', 
    totalPrice: 150, 
    address: 'كفر الدوار - شارع بورسعيد - برج السلام',
    notes: 'محتاج تركيب 3 نجفات في الصالة'
  },
  { 
    id: 'b2', 
    serviceId: 's5', 
    providerId: 'p2', 
    providerName: 'كابتن محمود ياسين', 
    date: '2026-03-20', 
    time: '02:00 م', 
    status: 'completed', 
    totalPrice: 1500, 
    address: 'كفر الدوار - منطقة المهاجرين'
  },
];

// --- Sub-components for Screens ---

export default function ServicesModule() {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingData, setBookingData] = useState<Partial<Booking>>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const navigateTo = (screen: string) => {
    if (screen === 'home') navigate('/services');
    else navigate(screen);
  };

  // 1. Home Services Screen
  const HomeScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-primary">خدمات كفراوي</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('notifications')} className="p-2.5 rounded-xl bg-[var(--background)] relative">
            <Bell className="w-5 h-5 text-[var(--muted)]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div onClick={() => navigateTo('dashboard')} className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/20 cursor-pointer">
            <img src="https://picsum.photos/seed/me/100" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="ابحث عن صنايعي أو خدمة..." 
              className="w-full bg-white border border-[var(--border)] rounded-2xl py-4 pr-12 pl-4 font-bold text-sm soft-shadow focus:outline-none focus:border-primary/50 transition-all"
            />
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-lg">التصنيفات</h3>
            <button className="text-primary text-sm font-bold">عرض الكل</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4">
            {CATEGORIES.map(cat => (
              <motion.button 
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (cat.id === 'teachers') navigateTo('teachers');
                  else navigateTo('list');
                }}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-primary shadow-sm neumorph">
                  {cat.icon}
                </div>
                <span className="text-xs font-black">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Professionals Carousel */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-lg">أفضل الصنايعية</h3>
            <button onClick={() => navigateTo('list')} className="text-primary text-sm font-bold">عرض الكل</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2">
            {PROVIDERS.map(provider => (
              <motion.div 
                key={provider.id}
                whileHover={{ y: -4 }}
                onClick={() => { setSelectedProvider(provider); navigateTo('profile'); }}
                className="min-w-[240px] bg-white rounded-[32px] border border-[var(--border)] p-4 soft-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                    <img src={provider.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{provider.name}</h4>
                    <p className="text-[10px] text-[var(--muted)] font-bold">{provider.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-[10px] font-black">{provider.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-1 rounded-lg">متاح الآن</span>
                  <span className="text-xs font-black text-primary">يبدأ من {provider.priceStart}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Offers Banner */}
        <div className="mt-8">
          <div onClick={() => navigateTo('offers')} className="relative h-40 rounded-[32px] overflow-hidden shadow-xl cursor-pointer group">
            <img src={OFFERS[0].image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex flex-col justify-center p-6 text-white">
              <h3 className="text-xl font-black mb-1">{OFFERS[0].title}</h3>
              <p className="text-xs opacity-90 mb-4">{OFFERS[0].subtitle}</p>
              <button className="bg-white text-primary font-black px-4 py-2 rounded-xl text-xs w-fit">
                {OFFERS[0].cta}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access to History */}
        <div className="mt-8 mb-4">
          <button 
            onClick={() => navigateTo('history')}
            className="w-full bg-white border border-[var(--border)] rounded-[24px] p-4 flex items-center justify-between soft-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="font-black text-sm">سجل خدماتك</h4>
                <p className="text-[10px] text-[var(--muted)] font-bold">تابع طلباتك السابقة والحالية</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>
      </main>

      {/* Bottom Nav Placeholder (handled by main App) */}
    </div>
  );

  // 2. Professionals List Screen
  const ListScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">قائمة الصنايعية</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-2.5 rounded-xl bg-white border border-[var(--border)]"
          >
            {viewMode === 'list' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
          <button onClick={() => navigateTo('filter')} className="p-2.5 rounded-xl bg-primary text-white">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-2 gap-4'}>
          {PROVIDERS.map(provider => (
            <motion.div 
              key={provider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-[32px] border border-[var(--border)] overflow-hidden soft-shadow ${viewMode === 'list' ? 'p-4 flex gap-4' : 'flex flex-col'}`}
            >
              <div className={viewMode === 'list' ? 'w-24 h-24 rounded-2xl overflow-hidden shrink-0' : 'w-full h-32'}>
                <img src={provider.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className={`flex-1 ${viewMode === 'grid' ? 'p-3' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[15px]">{provider.name}</h4>
                    <p className="text-[11px] text-[var(--muted)] font-bold">{provider.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black">{provider.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[10px] text-[var(--muted)] font-bold">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {provider.experience} سنوات
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {provider.completedWorks} عمل
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-black text-primary">{provider.priceStart}</span>
                  <button 
                    onClick={() => { setSelectedProvider(provider); navigateTo('profile'); }}
                    className="bg-primary/10 text-primary text-[11px] font-black px-4 py-2 rounded-xl"
                  >
                    عرض الملف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );

  // 3. Professional Profile Screen
  const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('services');
    if (!selectedProvider) return null;

    return (
      <div className="flex flex-col h-full bg-[var(--background)]">
        <div className="relative h-64 shrink-0">
          <img src={selectedProvider.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button 
            onClick={() => navigateTo('list')} 
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-md text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 inset-x-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black mb-1">{selectedProvider.name}</h2>
                <p className="text-sm opacity-90 font-bold">{selectedProvider.category}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-black">{selectedProvider.rating}</span>
                  <span className="text-[10px] opacity-70">({selectedProvider.reviews})</span>
                </div>
                <span className="text-[10px] bg-emerald-500 text-white px-3 py-1 rounded-full font-black">متاح الآن</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[var(--background)] -mt-6 rounded-t-[40px] relative z-10 overflow-hidden flex flex-col">
          <div className="flex border-b border-[var(--border)] px-6 pt-4">
            {['services', 'reviews', 'info'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-primary' : 'text-[var(--muted)]'}`}
              >
                {tab === 'services' ? 'الخدمات' : tab === 'reviews' ? 'التقييمات' : 'معلومات'}
                {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 inset-x-0 h-1 bg-primary rounded-t-full" />}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'services' && (
              <div className="space-y-4">
                {selectedProvider.services?.map(service => (
                  <div key={service.id} className="bg-white p-4 rounded-[24px] border border-[var(--border)] soft-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-[15px]">{service.name}</h4>
                      <span className="text-primary font-black">{service.price} ج.م</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] font-medium mb-4">{service.description}</p>
                    <button 
                      onClick={() => { setSelectedService(service); navigateTo('booking'); }}
                      className="w-full bg-primary/10 text-primary font-black py-3 rounded-xl text-sm"
                    >
                      حجز الخدمة
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-sm mb-2">نبذة عني</h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">{selectedProvider.bio}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-2xl border border-[var(--border)] text-center">
                    <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-[10px] font-black">{selectedProvider.experience} سنوات</p>
                    <p className="text-[8px] text-[var(--muted)] font-bold">خبرة</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[var(--border)] text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-[10px] font-black">{selectedProvider.completedWorks}</p>
                    <p className="text-[8px] text-[var(--muted)] font-bold">عمل منجز</p>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[var(--border)] text-center">
                    <ThumbsUp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-[10px] font-black">98%</p>
                    <p className="text-[8px] text-[var(--muted)] font-bold">رضا العملاء</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-black text-sm">معرض الأعمال</h4>
                    <button onClick={() => navigateTo('gallery')} className="text-primary text-[10px] font-black">عرض الكل</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProvider.gallery?.slice(0, 2).map((img, i) => (
                      <div key={i} className="aspect-video rounded-2xl overflow-hidden shadow-sm">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 4. Booking Service Screen
  const BookingScreen = () => {
    const [date, setDate] = useState('2026-03-25');
    const [time, setTime] = useState('10:00 ص');

    return (
      <div className="flex flex-col h-full bg-[var(--background)]">
        <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigateTo('profile')} className="p-2 rounded-xl bg-[var(--background)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">حجز خدمة</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-4 rounded-[24px] border border-[var(--border)] soft-shadow mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={selectedProvider?.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-black text-sm">{selectedService?.name}</h4>
              <p className="text-[10px] text-[var(--muted)] font-bold">مع {selectedProvider?.name}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-black text-sm mb-3">اختر التاريخ</h4>
              <div className="grid grid-cols-4 gap-3">
                {['24', '25', '26', '27'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDate(`2026-03-${d}`)}
                    className={`p-3 rounded-2xl border transition-all text-center ${date.includes(d) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-[var(--border)]'}`}
                  >
                    <p className="text-[10px] font-bold opacity-70">مارس</p>
                    <p className="text-lg font-black">{d}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm mb-3">اختر الوقت</h4>
              <div className="grid grid-cols-3 gap-3">
                {['09:00 ص', '10:00 ص', '11:00 ص', '01:00 م', '02:00 م', '03:00 م'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTime(t)}
                    className={`py-3 rounded-xl border text-xs font-black transition-all ${time === t ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-[var(--border)]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm mb-3">ملاحظات إضافية</h4>
              <textarea 
                placeholder="أضف أي ملاحظات أو تفاصيل أخرى للطلب..."
                className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-medium h-32 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </main>

        <div className="p-6 glass border-t border-[var(--border)] rounded-t-[40px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--muted)] font-bold">السعر الإجمالي:</span>
            <span className="text-2xl font-black text-primary">{selectedService?.price} ج.م</span>
          </div>
          <button 
            onClick={() => {
              setBookingData({
                serviceId: selectedService?.id,
                providerId: selectedProvider?.id,
                providerName: selectedProvider?.name,
                date,
                time,
                totalPrice: selectedService?.price
              });
              navigateTo('summary');
            }}
            className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-xl shadow-primary/30"
          >
            تأكيد الحجز
          </button>
        </div>
      </div>
    );
  };

  // 5. Checkout Screen
  const CheckoutScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('cash');

    return (
      <div className="flex flex-col h-full bg-[var(--background)]">
        <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigateTo('booking')} className="p-2 rounded-xl bg-[var(--background)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">الدفع والتحقق</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white p-5 rounded-[32px] border border-[var(--border)] soft-shadow">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-sm">عنوان الخدمة</h4>
              <button onClick={() => navigateTo('address')} className="text-primary text-[10px] font-black">تغيير</button>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black">المنزل</p>
                <p className="text-[11px] text-[var(--muted)] font-bold mt-1">كفر الدوار - شارع بورسعيد - برج السلام - الدور الرابع</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[32px] border border-[var(--border)] soft-shadow">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-sm">طريقة الدفع</h4>
              <button onClick={() => navigateTo('payment_selection')} className="text-primary text-[10px] font-black">تغيير</button>
            </div>
            <div className="space-y-3">
              {[
                { id: 'card', name: 'بطاقة ائتمان', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'wallet', name: 'محفظة كفراوي', icon: <Wallet className="w-5 h-5" /> },
                { id: 'cash', name: 'كاش عند الانتهاء', icon: <Banknote className="w-5 h-5" /> },
              ].map(method => (
                <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${paymentMethod === method.id ? 'bg-primary/5 border-primary' : 'bg-white border-[var(--border)]'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-[var(--background)] text-[var(--muted)]'}`}>
                      {method.icon}
                    </div>
                    <span className={`text-sm font-black ${paymentMethod === method.id ? 'text-primary' : ''}`}>{method.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary' : 'border-[var(--border)]'}`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-[32px] border border-[var(--border)] soft-shadow">
            <h4 className="font-black text-sm mb-4">ملخص الطلب</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--muted)]">سعر الخدمة</span>
                <span>{bookingData.totalPrice} ج.م</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--muted)]">رسوم الخدمة</span>
                <span>10 ج.م</span>
              </div>
              <div className="h-px bg-[var(--border)] my-2" />
              <div className="flex justify-between text-sm font-black">
                <span>الإجمالي</span>
                <span className="text-primary">{(bookingData.totalPrice || 0) + 10} ج.م</span>
              </div>
            </div>
          </div>
        </main>

        <div className="p-6 glass border-t border-[var(--border)] rounded-t-[40px]">
          <button 
            onClick={() => navigateTo('success')}
            className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-xl shadow-primary/30"
          >
            دفع وتأكيد الحجز
          </button>
        </div>
      </div>
    );
  };

  // 15. Success Screen
  const SuccessScreen = () => (
    <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h2 className="text-2xl font-black mb-2">تم تأكيد حجزك بنجاح!</h2>
      <p className="text-sm text-[var(--muted)] font-bold mb-12">تم إرسال طلبك للصنايعي، وسنقوم بإخطارك عند تحركه.</p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={() => navigateTo('tracking')}
          className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-lg shadow-primary/20"
        >
          تتبع حالة الطلب
        </button>
        <button 
          onClick={() => navigateTo('home')}
          className="w-full bg-[var(--background)] text-primary font-black py-4 rounded-[24px]"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  // 6. Service Tracking Screen
  const TrackingScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">تتبع الخدمة</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border)] soft-shadow mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
              <img src={PROVIDERS[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg">{PROVIDERS[0].name}</h4>
              <p className="text-xs text-[var(--muted)] font-bold">في الطريق إليك</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-primary/10 text-primary rounded-2xl"><Phone className="w-5 h-5" /></button>
              <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><MessageSquare className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="relative pt-4">
            <div className="absolute top-[22px] right-4 bottom-4 w-0.5 bg-[var(--border)]" />
            <div className="space-y-8 relative">
              {[
                { label: 'تم تأكيد الحجز', time: '10:05 ص', done: true },
                { label: 'الصنايعي في الطريق', time: '10:15 ص', done: true, current: true },
                { label: 'بدء العمل', time: '--:--', done: false },
                { label: 'تم الانتهاء', time: '--:--', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 ${step.done ? 'bg-primary border-primary/20 text-white' : 'bg-white border-[var(--border)] text-[var(--muted)]'}`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-sm font-black ${step.current ? 'text-primary' : step.done ? 'text-[var(--text-main)]' : 'text-[var(--muted)]'}`}>{step.label}</span>
                    <span className="text-[10px] text-[var(--muted)] font-bold">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <Navigation className="w-5 h-5" />
            <h4 className="font-black text-sm">الوقت المتوقع للوصول</h4>
          </div>
          <p className="text-3xl font-black">15 دقيقة</p>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="h-full bg-white"
            />
          </div>
        </div>
      </main>
    </div>
  );

  // 7. Service History Screen
  const HistoryScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">سجل الخدمات</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {BOOKINGS.map(booking => (
          <div key={booking.id} className="bg-white p-5 rounded-[32px] border border-[var(--border)] soft-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--background)] flex items-center justify-center text-primary">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm">{booking.providerName}</h4>
                  <p className="text-[10px] text-[var(--muted)] font-bold">{booking.date} • {booking.time}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                {booking.status === 'completed' ? 'مكتمل' : 'مؤكد'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-black text-primary">{booking.totalPrice} ج.م</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigateTo('details')}
                  className="text-[11px] font-black bg-primary/5 text-primary px-4 py-2 rounded-xl"
                >
                  التفاصيل
                </button>
                {booking.status === 'completed' && (
                  <button 
                    onClick={() => navigateTo('rating')}
                    className="text-[11px] font-black bg-amber-50 text-amber-600 px-4 py-2 rounded-xl"
                  >
                    تقييم
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );

  // 8. Rating & Review Screen
  const RatingScreen = () => {
    const [rating, setRating] = useState(0);

    return (
      <div className="flex flex-col h-full bg-white p-8">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl overflow-hidden mb-4 shadow-lg">
            <img src={PROVIDERS[0].image} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-black mb-1">كيف كانت تجربتك مع</h2>
          <h3 className="text-primary font-black text-lg mb-8">{PROVIDERS[0].name}؟</h3>
          
          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} onClick={() => setRating(star)}>
                <Star className={`w-10 h-10 ${rating >= star ? 'text-amber-500 fill-current' : 'text-[var(--border)]'}`} />
              </button>
            ))}
          </div>

          <textarea 
            placeholder="اكتب مراجعتك هنا... (اختياري)"
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-[32px] p-6 text-sm font-medium h-40 focus:outline-none focus:border-primary/50"
          />
        </div>

        <button 
          onClick={() => navigateTo('home')}
          className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-xl shadow-primary/30"
        >
          إرسال التقييم
        </button>
      </div>
    );
  };

  // 18. Search Filter Screen
  const FilterScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('list')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">تصفية النتائج</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h4 className="font-black text-sm mb-4">التصنيف</h4>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat.id} className="px-4 py-2 rounded-xl border border-[var(--border)] bg-white text-xs font-black hover:border-primary hover:text-primary transition-all">
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-sm mb-4">التقييم</h4>
          <div className="space-y-3">
            {[4, 3, 2].map(star => (
              <label key={star} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-[var(--border)] text-primary focus:ring-primary" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black">{star} نجوم وأكثر</span>
                  <div className="flex text-amber-500">
                    {[...Array(star)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black text-sm mb-4">نطاق السعر</h4>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-[var(--muted)] font-bold mb-1">من</p>
              <input type="number" placeholder="0" className="w-full bg-white border border-[var(--border)] rounded-xl p-3 text-sm font-bold" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-[var(--muted)] font-bold mb-1">إلى</p>
              <input type="number" placeholder="1000" className="w-full bg-white border border-[var(--border)] rounded-xl p-3 text-sm font-bold" />
            </div>
          </div>
        </div>
      </main>

      <div className="p-6 glass border-t border-[var(--border)] rounded-t-[40px] flex gap-4">
        <button className="flex-1 bg-[var(--background)] text-[var(--text-main)] font-black py-4 rounded-[24px]">مسح الكل</button>
        <button onClick={() => navigateTo('list')} className="flex-2 bg-primary text-white font-black py-4 rounded-[24px] shadow-lg">تطبيق الفلاتر</button>
      </div>
    </div>
  );

  // 19. Map View Screen
  const MapViewScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)] relative">
      <div className="absolute top-4 inset-x-4 z-10 flex justify-between items-center">
        <button onClick={() => navigateTo('home')} className="p-3 rounded-2xl bg-white soft-shadow text-[var(--text-main)]">
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input type="text" placeholder="ابحث في الخريطة..." className="w-full bg-white rounded-2xl py-3 pr-10 pl-4 text-xs font-bold soft-shadow" />
          </div>
        </div>
      </div>

      {/* Mock Map Background */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* User Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
          </div>
        </div>

        {/* Provider Pins */}
        {[
          { top: '30%', left: '40%', name: 'أحمد' },
          { top: '60%', left: '70%', name: 'محمود' },
          { top: '20%', left: '80%', name: 'ياسين' },
        ].map((pin, i) => (
          <div key={i} className="absolute" style={{ top: pin.top, left: pin.left }}>
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white px-2 py-1 rounded-lg soft-shadow mb-1">
                <p className="text-[8px] font-black">{pin.name}</p>
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center soft-shadow border-2 border-primary">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-24 inset-x-4">
        <div className="bg-white p-4 rounded-[32px] soft-shadow flex items-center gap-4 border border-[var(--border)]">
          <div className="w-14 h-14 rounded-2xl overflow-hidden">
            <img src={PROVIDERS[0].image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-sm">{PROVIDERS[0].name}</h4>
            <p className="text-[10px] text-[var(--muted)] font-bold">يبعد عنك 1.5 كم</p>
          </div>
          <button 
            onClick={() => { setSelectedProvider(PROVIDERS[0]); navigateTo('profile'); }}
            className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl"
          >
            عرض
          </button>
        </div>
      </div>
    </div>
  );

  // 9. Notifications Screen
  const NotificationsScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">إشعارات الخدمات</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {[
          { id: 1, title: 'تأكيد الحجز', body: 'تم تأكيد حجزك مع المهندس أحمد محمود بنجاح.', time: 'منذ 5 دقائق', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
          { id: 2, title: 'عرض خاص', body: 'خصم 30% على خدمات الدهان هذا الأسبوع!', time: 'منذ ساعة', icon: <Tag className="w-5 h-5" />, color: 'text-primary bg-primary/10' },
          { id: 3, title: 'تذكير بالخدمة', body: 'لديك خدمة سباكة غداً الساعة 10 صباحاً.', time: 'منذ 3 ساعات', icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
        ].map(notif => (
          <div key={notif.id} className="bg-white p-4 rounded-2xl border border-[var(--border)] flex gap-4 items-start soft-shadow">
            <div className={`p-3 rounded-xl ${notif.color} shrink-0`}>{notif.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-black text-sm">{notif.title}</h4>
                <span className="text-[10px] text-[var(--muted)] font-bold">{notif.time}</span>
              </div>
              <p className="text-xs text-[var(--muted)] font-medium leading-relaxed">{notif.body}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );

  // 11. Professional Dashboard Screen
  const DashboardScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">لوحة تحكم الصنايعي</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20">
            <p className="text-xs font-bold opacity-80 mb-1">إجمالي الأرباح</p>
            <h3 className="text-2xl font-black">4,500 ج.م</h3>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-[var(--border)] soft-shadow">
            <p className="text-xs font-bold text-[var(--muted)] mb-1">طلبات اليوم</p>
            <h3 className="text-2xl font-black text-primary">5</h3>
          </div>
        </div>
        <div>
          <h4 className="font-black text-sm mb-4">الطلبات الحالية</h4>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[var(--border)] soft-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">قيد التنفيذ</span>
                <span className="text-xs font-black">#12345</span>
              </div>
              <h5 className="font-black text-sm mb-1">صيانة تكييف - محمد علي</h5>
              <p className="text-[10px] text-[var(--muted)] font-bold mb-4">كفر الدوار - شارع الجيش</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-500 text-white font-black py-2 rounded-xl text-xs">تم الانتهاء</button>
                <button className="p-2 bg-[var(--background)] rounded-xl"><Phone className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // 12. Add New Address Screen
  const AddressScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('checkout')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">إضافة عنوان جديد</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black mr-2">اسم المنطقة</label>
          <input type="text" placeholder="مثلاً: المهاجرين" className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black mr-2">اسم الشارع</label>
          <input type="text" placeholder="اسم الشارع" className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black mr-2">رقم المبنى</label>
            <input type="text" placeholder="12" className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black mr-2">رقم الشقة</label>
            <input type="text" placeholder="4" className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-bold" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black mr-2">ملاحظات إضافية</label>
          <textarea placeholder="مثلاً: بجوار صيدلية..." className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 text-sm font-bold h-24" />
        </div>
      </main>
      <div className="p-6">
        <button onClick={() => navigateTo('checkout')} className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-xl">حفظ العنوان</button>
      </div>
    </div>
  );

  // 20. Upcoming Reminders Screen
  const RemindersScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">تذكيرات الخدمات</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {[
          { id: 1, service: 'صيانة سباكة', provider: 'المهندس أحمد محمود', time: 'غداً، 10:00 ص' },
          { id: 2, service: 'نقل أثاث', provider: 'كابتن محمود ياسين', time: 'الخميس، 02:00 م' },
        ].map(reminder => (
          <div key={reminder.id} className="bg-white p-5 rounded-[32px] border border-[var(--border)] soft-shadow flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
              <div>
                <h4 className="font-black text-sm">{reminder.service}</h4>
                <p className="text-[10px] text-[var(--muted)] font-bold">{reminder.provider}</p>
                <p className="text-[11px] text-primary font-black mt-1">{reminder.time}</p>
              </div>
            </div>
            <button className="p-2 text-[var(--muted)]"><ChevronLeft className="w-5 h-5" /></button>
          </div>
        ))}
      </main>
    </div>
  );

  // 10. Promotions & Offers Screen
  const OffersScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('home')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">العروض والخصومات</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {OFFERS.map(offer => (
          <div key={offer.id} className="relative h-48 rounded-[32px] overflow-hidden shadow-xl group">
            <img src={offer.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent flex flex-col justify-center p-8 text-white">
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full w-fit mb-2 border border-white/20">عرض محدود</span>
              <h3 className="text-2xl font-black mb-1">{offer.title}</h3>
              <p className="text-sm opacity-90 mb-6 font-medium">{offer.subtitle}</p>
              <button className="bg-white text-primary font-black px-6 py-3 rounded-2xl text-xs w-fit shadow-lg">
                تطبيق العرض الآن
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );

  // 16. Current Service Details Screen
  const ServiceDetailsScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('history')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">تفاصيل الخدمة</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border)] soft-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
              <img src={PROVIDERS[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-black text-lg">{PROVIDERS[0].name}</h4>
              <p className="text-xs text-[var(--muted)] font-bold">كهربائي منازل</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted)] font-bold">الحالة:</span>
              <span className="text-primary font-black">مؤكد</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted)] font-bold">التاريخ والوقت:</span>
              <span className="font-black">25 مارس، 10:00 ص</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted)] font-bold">العنوان:</span>
              <span className="font-black text-left max-w-[150px] truncate">كفر الدوار - شارع بورسعيد</span>
            </div>
            <div className="h-px bg-[var(--border)]" />
            <div className="flex justify-between items-center text-lg font-black">
              <span>الإجمالي:</span>
              <span className="text-primary">160 ج.م</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex-1 bg-primary text-white font-black py-4 rounded-[24px] shadow-lg">تواصل مع الصنايعي</button>
          <button className="p-4 bg-rose-50 text-rose-500 rounded-[24px] border border-rose-100"><Trash2 className="w-6 h-6" /></button>
        </div>
      </main>
    </div>
  );

  // 17. Professional Gallery Screen
  const GalleryScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('profile')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">معرض الأعمال</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {selectedProvider?.gallery?.map((img, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-[24px] overflow-hidden shadow-md border border-[var(--border)]"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square rounded-[24px] overflow-hidden shadow-md border border-[var(--border)]">
              <img src={`https://picsum.photos/seed/gal${i}/400/400`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  // 14. Service Summary Screen
  const SummaryScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('booking')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">ملخص الطلب</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border)] soft-shadow">
          <h4 className="font-black text-sm mb-4">تفاصيل الخدمة</h4>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={selectedProvider?.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black">{selectedService?.name}</p>
              <p className="text-[10px] text-[var(--muted)] font-bold">{selectedProvider?.name}</p>
            </div>
          </div>
          <div className="space-y-2 text-xs font-bold text-[var(--muted)]">
            <div className="flex justify-between"><span>التاريخ:</span><span className="text-[var(--text-main)]">{bookingData.date}</span></div>
            <div className="flex justify-between"><span>الوقت:</span><span className="text-[var(--text-main)]">{bookingData.time}</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border)] soft-shadow">
          <h4 className="font-black text-sm mb-4">التكلفة المتوقعة</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)] font-bold">سعر الخدمة</span>
              <span className="font-black">{bookingData.totalPrice} ج.م</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)] font-bold">ضريبة القيمة المضافة</span>
              <span className="font-black">15 ج.م</span>
            </div>
            <div className="h-px bg-[var(--border)]" />
            <div className="flex justify-between text-lg font-black text-primary">
              <span>الإجمالي</span>
              <span>{(bookingData.totalPrice || 0) + 15} ج.م</span>
            </div>
          </div>
        </div>
      </main>
      <div className="p-6">
        <button onClick={() => navigateTo('checkout')} className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-xl">المتابعة للدفع</button>
      </div>
    </div>
  );

  // 13. Payment Method Selection Screen
  const PaymentSelectionScreen = () => (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigateTo('checkout')} className="p-2 rounded-xl bg-[var(--background)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">اختر وسيلة الدفع</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {[
          { id: 'visa', name: 'فيزا **** 1234', icon: <CreditCard className="w-6 h-6" /> },
          { id: 'master', name: 'ماستركارد **** 5678', icon: <CreditCard className="w-6 h-6" /> },
          { id: 'fawry', name: 'فوري', icon: <Banknote className="w-6 h-6" /> },
          { id: 'vodafone', name: 'فودافون كاش', icon: <Wallet className="w-6 h-6" /> },
        ].map(method => (
          <button key={method.id} onClick={() => navigateTo('checkout')} className="w-full bg-white p-5 rounded-[24px] border border-[var(--border)] flex items-center justify-between soft-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 text-primary rounded-2xl">{method.icon}</div>
              <span className="font-black text-sm">{method.name}</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-[var(--muted)]" />
          </button>
        ))}
        <button className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-[24px] text-[var(--muted)] font-black text-sm flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> إضافة وسيلة دفع جديدة
        </button>
      </main>
    </div>
  );

  // --- Main Routing Logic ---
  return (
    <div className="fixed inset-0 z-[60] bg-[var(--background)] overflow-hidden">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/list" element={<ListScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/booking" element={<BookingScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/tracking" element={<TrackingScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/rating" element={<RatingScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/map" element={<MapViewScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/address" element={<AddressScreen />} />
        <Route path="/reminders" element={<RemindersScreen />} />
        <Route path="/offers" element={<OffersScreen />} />
        <Route path="/details" element={<ServiceDetailsScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
        <Route path="/summary" element={<SummaryScreen />} />
        <Route path="/payment_selection" element={<PaymentSelectionScreen />} />
        <Route path="/teachers/*" element={<TeachersScreen onBack={() => navigate('/services')} />} />
      </Routes>
    </div>
  );
}
