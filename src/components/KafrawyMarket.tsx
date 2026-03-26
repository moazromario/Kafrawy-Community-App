import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Plus, 
  ShoppingCart, 
  ArrowRight,
  Tag,
  Store as StoreIcon,
  Check,
  CheckCircle2,
  Zap,
  Clock,
  ImagePlus,
  Package,
  Gift,
  LayoutDashboard,
  User,
  Camera,
  Info,
  Wallet,
  Users,
  TrendingUp,
  Eye,
  BookOpen,
  Bell,
  MessageSquare,
  MapPin,
  Navigation,
  Video,
  Award,
  ChevronLeft,
  MoreVertical,
  Send
} from 'lucide-react';
import DynamicDetails from './DynamicDetails';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  image: string;
  category: string;
  description: string;
}

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  coverImage: string;
  description: string;
  location: string;
  isVerified: boolean;
  stats: {
    products: number;
    sales: number;
    followers: number;
  };
  products: Product[];
  projects: { id: string; title: string; description: string; image: string }[];
  offers: { id: string; title: string; discount: string; image: string; expiry: string }[];
}

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'عسل نحل سدر أصلي', 
    price: 150, 
    oldPrice: 200, 
    discount: '25%', 
    rating: 4.8, 
    image: 'https://picsum.photos/seed/honey/400/400', 
    category: 'أغذية',
    description: 'عسل نحل سدر جبلي أصلي 100%، مستخرج من أفضل المناحل في المنطقة. يتميز بطعمه الغني وفوائده الصحية المتعددة.'
  },
  { 
    id: '2', 
    name: 'طقم توابل خشب زان', 
    price: 350, 
    rating: 4.5, 
    image: 'https://picsum.photos/seed/spices/400/400', 
    category: 'منزل',
    description: 'طقم توابل أنيق مصنوع من خشب الزان الطبيعي، يضيف لمسة جمالية لمطبخك ويحافظ على نكهة التوابل.'
  },
  { 
    id: '3', 
    name: 'زيت زيتون بكر ممتاز', 
    price: 120, 
    oldPrice: 140, 
    discount: '15%', 
    rating: 4.9, 
    image: 'https://picsum.photos/seed/oliveoil/400/400', 
    category: 'أغذية',
    description: 'زيت زيتون بكر ممتاز معصور على البارد، غني بالأحماض الدهنية المفيدة ومضادات الأكسدة.'
  },
  { 
    id: '4', 
    name: 'سجادة صلاة قطيفة', 
    price: 280, 
    rating: 4.7, 
    image: 'https://picsum.photos/seed/rug/400/400', 
    category: 'إسلاميات',
    description: 'سجادة صلاة ناعمة جداً ومريحة، بتصميمات إسلامية عصرية وألوان هادئة تساعد على الخشوع.'
  },
  { 
    id: '5', 
    name: 'تمر مجدول فاخر', 
    price: 90, 
    oldPrice: 110, 
    discount: '18%', 
    rating: 4.6, 
    image: 'https://picsum.photos/seed/dates/400/400', 
    category: 'أغذية',
    description: 'تمر مجدول فاخر من أجود المزارع، يتميز بحجمه الكبير وطعمه السكري اللذيذ.'
  },
  { 
    id: '6', 
    name: 'مبخرة نحاس يدوية', 
    price: 450, 
    rating: 4.4, 
    image: 'https://picsum.photos/seed/mubkhara/400/400', 
    category: 'منزل',
    description: 'مبخرة نحاسية مصنوعة يدوياً بدقة عالية، قطعة فنية فريدة لتعطير منزلك بأرقى أنواع البخور.'
  },
];

const CATEGORIES = ['الكل', 'أغذية', 'منزل', 'إسلاميات', 'ملابس'];

const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: 'منحل الشفاء',
    category: 'أغذية طبيعية',
    rating: 4.9,
    reviews: 128,
    image: 'https://picsum.photos/seed/store1/200/200',
    coverImage: 'https://picsum.photos/seed/cover1/800/400',
    description: 'نقدم أجود أنواع عسل النحل الطبيعي ومنتجات الخلية منذ عام 2010. جودة نضمنها لك بكل حب.',
    location: 'كفر الدوار - شارع الجيش',
    isVerified: true,
    stats: { products: 15, sales: 1200, followers: 450 },
    products: MOCK_PRODUCTS.filter(p => p.category === 'أغذية'),
    projects: [
      { id: 'p1', title: 'موسم عسل السدر 2024', description: 'لقطات من عملية فرز العسل الطبيعي في مناحلنا الجبلية.', image: 'https://picsum.photos/seed/sp1/400/300' },
      { id: 'p2', title: 'تطوير التعبئة الذكية', description: 'استخدام عبوات صديقة للبيئة تحافظ على خواص العسل.', image: 'https://picsum.photos/seed/sp2/400/300' },
    ],
    offers: [
      { id: 'o1', title: 'عرض العائلة', discount: '20%', image: 'https://picsum.photos/seed/off1/400/300', expiry: 'ينتهي خلال يومين' },
    ]
  },
  {
    id: 's2',
    name: 'بيت التوابل',
    category: 'منتجات منزلية',
    rating: 4.7,
    reviews: 85,
    image: 'https://picsum.photos/seed/store2/200/200',
    coverImage: 'https://picsum.photos/seed/cover2/800/400',
    description: 'أفخر أنواع التوابل والبهارات المطحونة طازجة يومياً. نكهة أصيلة لكل طبخة.',
    location: 'كفر الدوار - الموقف الجديد',
    isVerified: true,
    stats: { products: 45, sales: 850, followers: 210 },
    products: MOCK_PRODUCTS.filter(p => p.category === 'منزل'),
    projects: [
      { id: 'p3', title: 'خلطاتنا الخاصة', description: 'ابتكار خلطات بهارات حصرية للمطبخ المصري.', image: 'https://picsum.photos/seed/sp3/400/300' },
    ],
    offers: [
      { id: 'o2', title: 'خصم الافتتاح', discount: '15%', image: 'https://picsum.photos/seed/off2/400/300', expiry: 'ينتهي اليوم' },
    ]
  },
  {
    id: 's3',
    name: 'سجاد الأصالة',
    category: 'مفروشات إسلامية',
    rating: 4.8,
    reviews: 92,
    image: 'https://picsum.photos/seed/store3/200/200',
    coverImage: 'https://picsum.photos/seed/cover3/800/400',
    description: 'أرقى سجاد الصلاة والمفروشات الإسلامية بتصاميم تجمع بين التراث والحداثة.',
    location: 'كفر الدوار - شارع بورسعيد',
    isVerified: true,
    stats: { products: 28, sales: 640, followers: 185 },
    products: MOCK_PRODUCTS.filter(p => p.category === 'إسلاميات'),
    projects: [
      { id: 'p4', title: 'مجموعة رمضان 2025', description: 'تصاميم حصرية لشهر رمضان المبارك.', image: 'https://picsum.photos/seed/sp4/400/300' },
    ],
    offers: [
      { id: 'o3', title: 'اشترِ 2 واحصل على 1', discount: 'مجاناً', image: 'https://picsum.photos/seed/off3/400/300', expiry: 'ينتهي خلال أسبوع' },
    ]
  }
];

export default function KafrawyMarket({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('الأحدث');
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'merchant'>('customer');
  const [view, setView] = useState<'market' | 'onboarding' | 'dashboard'>('market');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [activeProfileTab, setActiveProfileTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState<'product' | 'project' | 'offer' | 'profile' | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Form states for onboarding/adding
  const [newStore, setNewStore] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
  });
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [newProjects, setNewProjects] = useState<any[]>([]);
  const [newOffers, setNewOffers] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (id: string) => {
    setAddedToCartId(id);
    setCartCount(prev => prev + 1);
    setTimeout(() => setAddedToCartId(null), 1500);
  };

  const goToHome = () => { setView('market'); setSelectedStore(null); setSelectedProduct(null); };
  const goToOnboarding = () => setView('onboarding');
  const goToDashboard = () => setView('dashboard');

  if (selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
        {/* Store Header */}
        <div className="relative h-64">
          <img src={selectedStore.coverImage} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button 
            onClick={() => setSelectedStore(null)}
            className="absolute top-6 right-6 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/30"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="absolute -bottom-12 right-6 flex items-end gap-4">
            <div className="relative">
              <img src={selectedStore.image} className="w-24 h-24 rounded-[32px] border-4 border-white dark:border-slate-900 shadow-xl object-cover" />
              {selectedStore.isVerified && (
                <div className="absolute -bottom-1 -left-1 bg-royal-600 text-white p-1 rounded-lg border-2 border-white dark:border-slate-900">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-xl font-black text-white">{selectedStore.name}</h1>
              <p className="text-xs text-white/70 font-bold">{selectedStore.category}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pt-16 space-y-8">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 bg-royal-600 text-white rounded-2xl font-black shadow-lg shadow-royal-600/20 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> متابعة
            </button>
            <button className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'منتج', value: selectedStore.stats.products },
              { label: 'مبيعات', value: selectedStore.stats.sales },
              { label: 'متابع', value: selectedStore.stats.followers },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 text-center">
                <div className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800">
            {[
              { id: 'products', label: 'المنتجات', icon: <Package className="w-4 h-4" /> },
              { id: 'projects', label: 'الأعمال', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'offers', label: 'العروض', icon: <Gift className="w-4 h-4" /> },
              { id: 'about', label: 'عن المتجر', icon: <Info className="w-4 h-4" /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 ${activeProfileTab === tab.id ? 'text-royal-600' : 'text-slate-400'}`}
              >
                {tab.icon}
                {tab.label}
                {activeProfileTab === tab.id && <motion.div layoutId="activeProfileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-royal-600 rounded-full" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeProfileTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4"
              >
                {selectedStore.products.map(product => (
                  <div key={product.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm">
                    <img src={product.image} className="aspect-square w-full object-cover" />
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{product.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-royal-600 font-black text-sm">{product.price} ج.م</span>
                        <button className="p-2 bg-royal-50 dark:bg-royal-900/20 rounded-xl text-royal-600">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeProfileTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {selectedStore.projects.map(project => (
                  <div key={project.id} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-50 dark:border-slate-800 shadow-sm">
                    <img src={project.image} className="aspect-video w-full object-cover" />
                    <div className="p-6 space-y-2">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{project.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeProfileTab === 'offers' && (
              <motion.div 
                key="offers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {selectedStore.offers.map(offer => (
                  <div key={offer.id} className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[40px] p-6 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">عرض محدود</div>
                      <h4 className="text-2xl font-black">{offer.title}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-black">{offer.discount}</div>
                        <div className="text-xs font-bold opacity-80">{offer.expiry}</div>
                      </div>
                      <button className="w-full py-3 bg-white text-rose-600 rounded-2xl font-black">احصل على العرض</button>
                    </div>
                    <Gift className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10 rotate-12" />
                  </div>
                ))}
              </motion.div>
            )}

            {activeProfileTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">عن المتجر</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{selectedStore.description}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">الموقع</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 h-48 rounded-[40px] relative overflow-hidden flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-slate-300" />
                    <div className="absolute bottom-4 right-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl flex items-center gap-3 border border-white/20">
                      <div className="w-12 h-12 bg-royal-50 dark:bg-royal-900/20 rounded-2xl flex items-center justify-center text-royal-600 shrink-0">
                        <Navigation className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{selectedStore.location}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">كفر الدوار، البحيرة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    const steps = [
      { id: 1, title: 'معلومات المتجر' },
      { id: 2, title: 'المنتجات والأعمال' },
      { id: 3, title: 'التوثيق' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={goToHome} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">انضم كتاجر</h1>
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
            <p className="text-sm text-slate-400 font-bold">أكمل البيانات التالية لفتح متجرك في كفراوي ماركت</p>
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
                  <label className="text-xs font-black text-slate-400 mr-2">اسم المتجر</label>
                  <input type="text" placeholder="مثال: منحل الشفاء" className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">التخصص</label>
                  <select className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm appearance-none">
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-2">وصف المتجر</label>
                  <textarea placeholder="تحدث عن متجرك وما يميزك..." className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-royal-500/20 rounded-2xl p-4 text-sm font-bold shadow-sm h-32 resize-none" />
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
                <div className="bg-royal-50 dark:bg-royal-900/10 border border-royal-100 dark:border-royal-900/30 p-4 rounded-2xl flex gap-3">
                  <Package className="w-5 h-5 text-royal-600 shrink-0" />
                  <p className="text-xs text-royal-700 dark:text-royal-400 font-bold leading-relaxed">أضف أول منتج لك أو نموذج من أعمالك السابقة.</p>
                </div>
                <button className="w-full aspect-video rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <ImagePlus className="w-12 h-12" />
                  <span className="font-black">رفع صور المنتجات</span>
                </button>
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
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">يرجى رفع صورة من البطاقة الشخصية أو السجل التجاري لتوثيق المتجر.</p>
                </div>
                <button className="w-full aspect-video rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Camera className="w-12 h-12" />
                  <span className="font-black">رفع المستندات</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-8">
            {onboardingStep > 1 && (
              <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black">السابق</button>
            )}
            <button 
              onClick={() => {
                if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1);
                else {
                  setUserRole('merchant');
                  goToDashboard();
                }
              }}
              className="flex-[2] py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
            >
              {onboardingStep === 3 ? 'فتح المتجر' : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
        <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-royal-100">
                <img src="https://picsum.photos/seed/merchant/100/100" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">لوحة التاجر</h1>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> متجرك نشط
                </div>
              </div>
            </div>
            <button onClick={() => { setUserRole('customer'); goToHome(); }} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <User className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-royal-50 dark:bg-royal-900/20 rounded-xl flex items-center justify-center text-royal-600"><Package className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">24</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">منتج نشط</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600"><Wallet className="w-5 h-5" /></div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">8.2k</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الأرباح (ج.م)</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">إدارة المتجر</h2>
              <button 
                onClick={() => setSelectedStore(MOCK_STORES[0])}
                className="text-xs font-black text-royal-600 bg-royal-50 dark:bg-royal-900/20 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> معاينة المتجر
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'product', label: 'إضافة منتج', icon: <Plus className="w-5 h-5" />, color: 'bg-royal-50 text-royal-600' },
                { id: 'offer', label: 'إضافة عرض', icon: <Gift className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600' },
                { id: 'project', label: 'إضافة عمل', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
                { id: 'profile', label: 'تعديل الملف', icon: <User className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setShowAddModal(item.id as any)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-transform"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center`}>{item.icon}</div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">أحدث الطلبات</h2>
            <div className="space-y-3">
              {[
                { id: '#1234', customer: 'أحمد محمد', date: 'منذ ساعتين', total: '450 ج.م', status: 'قيد التنفيذ' },
                { id: '#1235', customer: 'سارة علي', date: 'منذ 5 ساعات', total: '1,200 ج.م', status: 'مكتمل' },
              ].map((order, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs">
                      {order.id}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{order.customer}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-royal-600">{order.total}</div>
                    <div className={`text-[10px] font-bold ${order.status === 'مكتمل' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Modals */}
          <AnimatePresence>
            {showAddModal && (
              <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAddModal(null)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 overflow-y-auto max-h-[90vh]"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black">
                      {showAddModal === 'product' ? 'إضافة منتج جديد' : 
                       showAddModal === 'project' ? 'إضافة عمل جديد' : 
                       showAddModal === 'offer' ? 'إضافة عرض جديد' : 'تعديل الملف الشخصي'}
                    </h3>
                    <button onClick={() => setShowAddModal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <ChevronDown className="w-6 h-6" />
                    </button>
                  </div>

                    <div className="space-y-4">
                      {showAddModal === 'profile' ? (
                        <>
                          <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                              <img src="https://picsum.photos/seed/merchant/100/100" className="w-24 h-24 rounded-[32px] object-cover border-4 border-royal-50 transition-transform group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/20 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">اسم المتجر</label>
                              <input type="text" defaultValue="منحل الشفاء" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">التخصص</label>
                              <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold appearance-none border border-transparent focus:border-royal-500/20 transition-all">
                                {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">الموقع بالتفصيل</label>
                            <input type="text" defaultValue="كفر الدوار - شارع الجيش - بجوار مسجد السلام" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">رابط الموقع على الخريطة (اختياري)</label>
                            <input type="text" placeholder="https://maps.google.com/..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                        </>
                      ) : showAddModal === 'product' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">اسم المنتج</label>
                            <input type="text" placeholder="مثال: عسل سدر أصلي" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">السعر الحالي (ج.م)</label>
                              <input type="number" placeholder="150" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">السعر قبل الخصم (اختياري)</label>
                              <input type="number" placeholder="200" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">الكمية المتوفرة</label>
                              <input type="number" placeholder="50" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">التصنيف</label>
                              <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold appearance-none border border-transparent focus:border-royal-500/20 transition-all">
                                {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : showAddModal === 'project' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">عنوان المشروع / العمل</label>
                            <input type="text" placeholder="مثال: تجهيز مطعم المدينة" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">تاريخ التنفيذ</label>
                            <input type="date" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400">عنوان العرض</label>
                            <input type="text" placeholder="مثال: عرض نهاية العام" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">قيمة الخصم</label>
                              <input type="text" placeholder="مثال: 20%" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400">تاريخ الانتهاء</label>
                              <input type="date" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold border border-transparent focus:border-royal-500/20 transition-all" />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400">الوصف التفصيلي</label>
                        <textarea placeholder="اكتب تفاصيل أكثر هنا..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold h-24 resize-none border border-transparent focus:border-royal-500/20 transition-all" />
                      </div>
                      
                      {showAddModal !== 'profile' && (
                        <button className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-royal-500/50 transition-colors group">
                          <ImagePlus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black">رفع الصور (يمكنك رفع حتى 5 صور)</span>
                        </button>
                      )}
                    </div>

                  <button 
                    onClick={() => setShowAddModal(null)}
                    className="w-full py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20"
                  >
                    حفظ ونشر
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">أحدث الطلبات</h2>
            {[
              { id: '101', customer: 'أحمد علي', total: '450 ج.م', status: 'قيد التنفيذ' },
              { id: '102', customer: 'سارة محمود', total: '120 ج.م', status: 'مكتمل' },
            ].map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><ShoppingCart className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">طلب #{order.id}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-royal-600">{order.total}</p>
                  <p className={`text-[8px] font-bold ${order.status === 'مكتمل' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <DynamicDetails 
        title={selectedProduct.name}
        subtitle={selectedProduct.category}
        image={selectedProduct.image}
        rating={selectedProduct.rating}
        reviews={Math.floor(Math.random() * 200) + 50}
        price={`${selectedProduct.price} ج.م`}
        description={selectedProduct.description}
        mainActionLabel="أضف إلى السلة"
        onMainAction={() => handleAddToCart(selectedProduct.id)}
        onBack={() => setSelectedProduct(null)}
        category="كفراوي ماركت"
        features={[
          { icon: <Zap className="w-4 h-4" />, label: 'توصيل سريع', value: 'خلال 30 دقيقة' },
          { icon: <StoreIcon className="w-4 h-4" />, label: 'المتجر', value: 'كفراوي ماركت' },
          { icon: <Clock className="w-4 h-4" />, label: 'الضمان', value: '7 أيام استرجاع' },
          { icon: <Tag className="w-4 h-4" />, label: 'الحالة', value: 'متوفر' },
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-royal-900 dark:text-royal-100">كفراوي ماركت</h1>
          <button onClick={() => setShowCart(true)} className="mr-auto relative">
            <ShoppingCart className="w-6 h-6 text-royal-600" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pr-10 pl-4 text-sm focus:ring-2 focus:ring-royal-500"
            />
          </div>
          <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-4 border-b border-slate-100 dark:border-slate-800">
          {['الأحدث', 'الأكثر مبيعاً', 'العروض'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-royal-600' : 'text-slate-500'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-royal-600" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-4">
        {/* Featured Offers Banner */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-royal-600 to-royal-800 rounded-[32px] p-6 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-sm">عروض رمضان 🌙</span>
              <h2 className="text-2xl font-black">خصومات تصل إلى 50%</h2>
              <p className="text-xs opacity-80 font-bold">على جميع منتجات العسل والتمور</p>
              <button className="mt-2 bg-white text-royal-900 px-5 py-2 rounded-xl text-xs font-black shadow-lg">تسوق الآن</button>
            </div>
            <Gift className="absolute -bottom-4 -left-4 w-32 h-32 opacity-10 -rotate-12" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          </div>
        </section>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium whitespace-nowrap hover:border-royal-500 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Stores */}
        <section className="mt-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">أبرز المتاجر</h2>
            <button className="text-xs font-bold text-royal-600">عرض الكل</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {MOCK_STORES.map(store => (
              <motion.div 
                key={store.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStore(store)}
                className="flex-shrink-0 w-48 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center cursor-pointer"
              >
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                  {store.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-royal-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{store.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mb-2">{store.category}</p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-current" /> {store.rating}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">أحدث المنتجات</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            MOCK_PRODUCTS.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedProduct(product)}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col cursor-pointer"
              >
                <div className="relative aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {product.discount}
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 mb-1">
                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                  </div>
                  <h3 className="text-sm font-bold mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-royal-700 dark:text-royal-400 font-bold">{product.price} ج.م</span>
                    {product.oldPrice && (
                      <span className="text-[10px] text-slate-400 line-through">{product.oldPrice} ج.م</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      addedToCartId === product.id 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-royal-50 dark:bg-royal-900/30 text-royal-700 dark:text-royal-400 hover:bg-royal-100'
                    }`}
                  >
                    {addedToCartId === product.id ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                        <Check className="w-4 h-4" /> تم الإضافة
                      </motion.div>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> أضف للسلة
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Merchant Section */}
        <section className="mt-8 mb-4">
          <div className="bg-gradient-to-br from-royal-900 to-royal-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">هل أنت تاجر في كفر الدوار؟</h2>
              <p className="text-sm opacity-90 mb-4">اعرض منتجاتك الآن في كفراوي ماركت واصل لآلاف العملاء.</p>
              <button 
                onClick={goToOnboarding}
                className="bg-gold-500 hover:bg-gold-600 text-royal-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <StoreIcon className="w-4 h-4" /> أضف منتجك الآن
              </button>
            </div>
            <StoreIcon className="absolute -bottom-4 -left-4 w-32 h-32 opacity-10 rotate-12" />
          </div>
        </section>

        {/* Featured Stores */}
        <section className="mt-8 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">متاجر مميزة</h2>
            <span className="text-royal-600 text-xs font-black">عرض الكل</span>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {MOCK_STORES.map(store => (
              <div 
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="min-w-[200px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-4 space-y-3 shadow-sm cursor-pointer"
              >
                <div className="relative">
                  <img src={store.image} className="w-full h-32 rounded-2xl object-cover" />
                  {store.isVerified && (
                    <div className="absolute top-2 right-2 bg-royal-600 text-white p-1 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{store.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{store.category}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black">
                    <Star className="w-3 h-3 fill-current" /> {store.rating}
                  </div>
                  <span className="text-[10px] text-royal-600 font-black">{store.stats.products} منتج</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-royal-50 dark:bg-royal-900/20 rounded-2xl flex items-center justify-center text-royal-600">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black">سلة المشتريات</h3>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              {cartCount === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <ShoppingCart className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-bold">السلة فارغة حالياً</p>
                  <button onClick={() => setShowCart(false)} className="text-royal-600 font-black text-sm">ابدأ التسوق الآن</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Sample Cart Item */}
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                        <img src="https://picsum.photos/seed/honey/200/200" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black">عسل نحل سدر أصلي</h4>
                        <p className="text-xs text-royal-600 font-bold">150 ج.م</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                        <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded-lg shadow-sm font-bold">-</button>
                        <span className="text-sm font-black">1</span>
                        <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded-lg shadow-sm font-bold">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">الإجمالي</span>
                      <span className="text-xl font-black text-royal-600">150 ج.م</span>
                    </div>
                    <button className="w-full py-4 bg-royal-600 text-white rounded-2xl font-black shadow-xl shadow-royal-600/20 flex items-center justify-center gap-2">
                      إتمام الطلب <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-3 px-8 flex justify-between items-center z-50">
        <button onClick={goToHome} className={`flex flex-col items-center gap-1 ${view === 'market' ? 'text-royal-600' : 'text-slate-400'}`}>
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-medium">المتجر</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Tag className="w-6 h-6" />
          <span className="text-[10px] font-medium">العروض</span>
        </button>
        <button onClick={userRole === 'merchant' ? goToDashboard : goToOnboarding} className={`flex flex-col items-center gap-1 ${view !== 'market' ? 'text-royal-600' : 'text-slate-400'}`}>
          <Plus className="w-6 h-6" />
          <span className="text-[10px] font-medium">{userRole === 'merchant' ? 'لوحة التحكم' : 'بيع'}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">بحث</span>
        </button>
      </div>

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
