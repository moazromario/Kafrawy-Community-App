import React from 'react';
import { 
  ShoppingBag, 
  Briefcase, 
  ShoppingCart, 
  TrendingUp, 
  MessageCircle,
  Smartphone,
  Watch,
  Shirt,
  Home as HomeIcon,
  Gamepad,
  Coffee,
  HeartPulse,
  Stethoscope,
  Hospital,
  Pill,
  Microscope,
  BookOpen,
  Droplets,
  Wrench,
  GraduationCap,
  Moon,
  Book,
  Scroll,
  History,
  Car,
  Users,
  Store,
  LayoutDashboard,
  User,
  Sparkles
} from 'lucide-react';
import { 
  Post, 
  Story, 
  Product, 
  Job, 
  ServiceProvider, 
  QuickAction, 
  PromoBanner,
  Recommendation,
  MarketplaceCategory,
  TickerItem,
  AppModule
} from './types';

export const TICKER_ITEMS: TickerItem[] = [
  { id: 'g1', text: 'سعر الذهب عيار 21: 3250 ج.م', type: 'gold' },
  { id: 'g2', text: 'سعر الذهب عيار 18: 2785 ج.م', type: 'gold' },
  { id: 'n1', text: 'خبر عاجل: افتتاح المرحلة الثانية من تطوير وسط المدينة غداً', type: 'news' },
  { id: 'p1', text: 'بورصة الدواجن: الفراخ البيضاء 85 ج.م للكيلو', type: 'poultry' },
  { id: 'c1', text: 'الدولار اليوم: 48.50 ج.م للشراء', type: 'currency' },
];

export const APP_MODULES: AppModule[] = [
  {
    id: 'health',
    title: 'الصحة',
    icon: <HeartPulse className="w-8 h-8" />,
    color: 'bg-rose-500',
    path: '/medical',
    subModules: [
      { id: 'doctors', title: 'الأطباء', icon: <Stethoscope className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/doctors' },
      { id: 'hospitals', title: 'المستشفيات', icon: <Hospital className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/hospitals' },
      { id: 'pharmacies', title: 'الصيدليات', icon: <Pill className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/pharmacies' },
      { id: 'labs', title: 'المعامل', icon: <Microscope className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/labs' },
      { id: 'articles', title: 'مقالات طبية', icon: <BookOpen className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/articles' },
      { id: 'blood', title: 'فصائل الدم', icon: <Droplets className="w-5 h-5" />, color: 'bg-rose-500', path: '/medical/blood' },
    ]
  },
  {
    id: 'services',
    title: 'الخدمات',
    icon: <Wrench className="w-8 h-8" />,
    color: 'bg-blue-500',
    path: '/services',
    subModules: [
      { id: 'craftsmen', title: 'الصنايعية', icon: <Wrench className="w-5 h-5" />, color: 'bg-blue-500', path: '/services/list' },
      { id: 'teachers', title: 'المدرسين', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-blue-500', path: '/services/teachers' },
    ]
  },
  {
    id: 'islamic',
    title: 'إسلاميات',
    icon: <Moon className="w-8 h-8" />,
    color: 'bg-emerald-600',
    path: '/islamic',
    subModules: [
      { id: 'quran', title: 'القرآن الكريم', icon: <Book className="w-5 h-5" />, color: 'bg-emerald-600', path: '/islamic/quran' },
      { id: 'hadith', title: 'الأحاديث', icon: <Scroll className="w-5 h-5" />, color: 'bg-emerald-600', path: '/islamic/hadith' },
      { id: 'azkar', title: 'الأذكار', icon: <Sparkles className="w-5 h-5" />, color: 'bg-emerald-600', path: '/islamic/azkar' },
      { id: 'articles', title: 'مقالات إسلامية', icon: <History className="w-5 h-5" />, color: 'bg-emerald-600', path: '/islamic/articles' },
    ]
  },
  {
    id: 'go',
    title: 'كفراوي جو',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-amber-500',
    path: '/go'
  },
  {
    id: 'community',
    title: 'المجتمع',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-indigo-500',
    path: '/community'
  },
  {
    id: 'stores',
    title: 'المتاجر',
    icon: <Store className="w-8 h-8" />,
    color: 'bg-violet-500',
    path: '/marketplace'
  },
  {
    id: 'jobs',
    title: 'الوظائف',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'bg-teal-500',
    path: '/jobs'
  }
];

export const BEST_OFFERS: Product[] = [
  { 
    id: 'off1', 
    name: 'عرض التوفير: طقم حلل جرانيت', 
    price: 1850, 
    oldPrice: 2500,
    image: 'https://picsum.photos/seed/cookware/400/400', 
    category: 'منزل',
    rating: 4.9,
    reviews: 45,
    isHot: true
  },
  { 
    id: 'off2', 
    name: 'خصم 30% على آيفون 15 برو', 
    price: 45000, 
    oldPrice: 55000,
    image: 'https://picsum.photos/seed/iphone/400/400', 
    category: 'إلكترونيات',
    rating: 5.0,
    reviews: 12
  }
];

export const STORIES: Story[] = [
  { 
    id: '1', 
    userName: 'أحمد علي', 
    userAvatar: 'https://picsum.photos/seed/u1/100', 
    thumbnail: 'https://picsum.photos/seed/s1/200/300',
    isSeen: false,
    content: ['https://picsum.photos/seed/sc1/1080/1920', 'https://picsum.photos/seed/sc2/1080/1920']
  },
  { 
    id: '2', 
    userName: 'سارة محمد', 
    userAvatar: 'https://picsum.photos/seed/u2/100', 
    thumbnail: 'https://picsum.photos/seed/s2/200/300',
    isSeen: false,
    content: ['https://picsum.photos/seed/sc3/1080/1920']
  },
  { 
    id: '3', 
    userName: 'مطعم المدينة', 
    userAvatar: 'https://picsum.photos/seed/u3/100', 
    thumbnail: 'https://picsum.photos/seed/s3/200/300',
    isSeen: true,
    content: ['https://picsum.photos/seed/sc4/1080/1920']
  },
  { 
    id: '4', 
    userName: 'كفراوي ماركت', 
    userAvatar: 'https://picsum.photos/seed/u4/100', 
    thumbnail: 'https://picsum.photos/seed/s4/200/300',
    isSeen: false,
    content: ['https://picsum.photos/seed/sc5/1080/1920']
  },
  { 
    id: '5', 
    userName: 'ياسين محمود', 
    userAvatar: 'https://picsum.photos/seed/u5/100', 
    thumbnail: 'https://picsum.photos/seed/s5/200/300',
    isSeen: true,
    content: ['https://picsum.photos/seed/sc6/1080/1920']
  },
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    author: { name: 'كفراوي نيوز', avatar: 'https://picsum.photos/seed/news/100', isVerified: true, role: 'إخباري' },
    content: 'تم اليوم افتتاح الممشى السياحي الجديد بمدينة كفر الدوار، بحضور عدد من القيادات التنفيذية. الممشى يمتد لمسافة 2 كم ويضم مناطق ترفيهية ومساحات خضراء.',
    image: 'https://picsum.photos/seed/walk/800/500',
    likes: 1240,
    comments: 85,
    shares: 42,
    time: 'منذ ساعتين',
    type: 'image',
    tags: ['كفر_الدوار', 'تطوير', 'سياحة']
  },
  {
    id: 'p2',
    author: { name: 'محمد حسن', avatar: 'https://picsum.photos/seed/user1/100' },
    content: 'يا جماعة حد يعرف صنايعي سباكة شاطر في منطقة المهاجرين؟ عندي مشكلة في المواسير ومحتاج حد ضروري.',
    likes: 12,
    comments: 24,
    shares: 2,
    time: 'منذ 15 دقيقة',
    type: 'text',
    tags: ['مساعدة', 'سباكة']
  },
  {
    id: 'p3',
    author: { name: 'عروض كفراوي', avatar: 'https://picsum.photos/seed/offers/100', isVerified: true },
    content: 'شاهدوا أحدث عروض التوفير من كفراوي ماركت لهذا الأسبوع! خصومات تصل إلى 50% على جميع المنتجات الغذائية.',
    video: 'https://picsum.photos/seed/video/800/500',
    likes: 450,
    comments: 32,
    shares: 110,
    time: 'منذ 5 ساعات',
    type: 'video',
    tags: ['توفير', 'عروض', 'تسوق']
  },
  {
    id: 'p4',
    author: { name: 'تكنولوجيا اليوم', avatar: 'https://picsum.photos/seed/tech/100' },
    content: 'أبل تعلن عن ميزات الذكاء الاصطناعي الجديدة في تحديث iOS القادم. هل تعتقد أنها ستغير طريقة استخدامنا للهواتف؟',
    link: {
      url: 'https://example.com/apple-ai',
      title: 'ميزات الذكاء الاصطناعي من أبل',
      description: 'كل ما تريد معرفته عن تحديثات أبل القادمة وميزات Apple Intelligence.',
      image: 'https://picsum.photos/seed/apple/400/200'
    },
    likes: 89,
    comments: 15,
    shares: 8,
    time: 'منذ ساعة',
    type: 'link',
    tags: ['تقنية', 'أبل', 'ذكاء_اصطناعي']
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'market', label: 'السوق', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-blue-500' },
  { id: 'jobs', label: 'الوظائف', icon: <Briefcase className="w-6 h-6" />, color: 'bg-emerald-500' },
  { id: 'orders', label: 'طلباتي', icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-amber-500' },
  { id: 'offers', label: 'العروض', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-rose-500' },
  { id: 'messages', label: 'الرسائل', icon: <MessageCircle className="w-6 h-6" />, color: 'bg-indigo-500' },
];

export const PRODUCTS: Product[] = [
  { 
    id: 'pr1', 
    name: 'سماعات لاسلكية Pro', 
    price: 450, 
    oldPrice: 600,
    image: 'https://picsum.photos/seed/pod/300/300', 
    category: 'إلكترونيات',
    rating: 4.8,
    reviews: 128,
    isHot: true,
    description: 'سماعات لاسلكية عالية الجودة مع خاصية إلغاء الضوضاء وبطارية تدوم طويلاً.',
    seller: { name: 'متجر التقنية', avatar: 'https://picsum.photos/seed/s1/100', rating: 4.9 },
    gallery: ['https://picsum.photos/seed/pod1/600/600', 'https://picsum.photos/seed/pod2/600/600'],
    specs: { 'البطارية': '24 ساعة', 'الاتصال': 'Bluetooth 5.2', 'اللون': 'أبيض' }
  },
  { 
    id: 'pr2', 
    name: 'ساعة ذكية S3 Ultra', 
    price: 890, 
    oldPrice: 1200,
    image: 'https://picsum.photos/seed/watch/300/300', 
    category: 'إلكترونيات',
    rating: 4.9,
    reviews: 256,
    isHot: false,
    description: 'ساعة ذكية متطورة تتبع نشاطك الرياضي وصحتك بدقة عالية مع شاشة AMOLED.',
    seller: { name: 'عالم الساعات', avatar: 'https://picsum.photos/seed/s2/100', rating: 4.7 },
    gallery: ['https://picsum.photos/seed/watch1/600/600'],
    specs: { 'الشاشة': '1.43 inch', 'المقاومة': 'IP68', 'النظام': 'Android/iOS' }
  },
  { 
    id: 'pr3', 
    name: 'حقيبة ظهر جلدية', 
    price: 320, 
    image: 'https://picsum.photos/seed/bag/300/300', 
    category: 'موضة',
    rating: 4.5,
    reviews: 64,
    description: 'حقيبة ظهر مصنوعة من الجلد الطبيعي بتصميم عصري ومساحات تخزين واسعة.',
    seller: { name: 'أناقة كفراوي', avatar: 'https://picsum.photos/seed/s3/100', rating: 4.5 }
  },
  { 
    id: 'pr4', 
    name: 'قميص صيفي قطني', 
    price: 250, 
    image: 'https://picsum.photos/seed/shirt/300/300', 
    category: 'موضة',
    rating: 4.2,
    reviews: 45,
    description: 'قميص صيفي مريح مصنوع من القطن المصري 100% بألوان زاهية.'
  },
  { 
    id: 'pr5', 
    name: 'ماكينة قهوة Espresso', 
    price: 1500, 
    oldPrice: 1800,
    image: 'https://picsum.photos/seed/coffee/300/300', 
    category: 'منزل',
    rating: 4.7,
    reviews: 89,
    isHot: true,
    description: 'استمتع بأفضل كوب قهوة في منزلك مع ماكينة الإسبريسو الاحترافية.'
  },
  { 
    id: 'pr6', 
    name: 'طقم أواني طهي', 
    price: 2200, 
    image: 'https://picsum.photos/seed/cook/300/300', 
    category: 'منزل',
    rating: 4.8,
    reviews: 112
  },
];

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: 'cat1', name: 'إلكترونيات', icon: <Smartphone className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_elec/400/300' },
  { id: 'cat2', name: 'موضة', icon: <Shirt className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_fashion/400/300' },
  { id: 'cat3', name: 'منزل', icon: <HomeIcon className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_home/400/300' },
  { id: 'cat4', name: 'ألعاب', icon: <Gamepad className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_game/400/300' },
  { id: 'cat5', name: 'ساعات', icon: <Watch className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_watch/400/300' },
  { id: 'cat6', name: 'أخرى', icon: <Coffee className="w-6 h-6" />, image: 'https://picsum.photos/seed/c_other/400/300' },
];

export const JOBS: Job[] = [
  { 
    id: 'j1', 
    title: 'محاسب مالي أول', 
    company: 'شركة النيل للتجارة', 
    location: 'كفر الدوار', 
    salary: '7000 - 9000 ج.م', 
    logo: 'https://picsum.photos/seed/c1/100',
    type: 'دوام كامل',
    postedAt: 'منذ يوم'
  },
  { 
    id: 'j2', 
    title: 'مندوب مبيعات خارجي', 
    company: 'مجموعة الفؤاد', 
    location: 'دمنهور', 
    salary: '4000 + عمولة مجزية', 
    logo: 'https://picsum.photos/seed/c2/100',
    type: 'دوام جزئي',
    postedAt: 'منذ 5 ساعات'
  },
];

export const SERVICES: ServiceProvider[] = [
  { 
    id: 's1', 
    name: 'المهندس أحمد محمود', 
    category: 'كهربائي منازل', 
    rating: 4.9, 
    reviews: 85,
    image: 'https://picsum.photos/seed/d1/100', 
    isAvailable: true,
    priceStart: 'من 100 ج.م'
  },
  { 
    id: 's2', 
    name: 'كابتن محمود ياسين', 
    category: 'توصيل طلبات', 
    rating: 4.7, 
    reviews: 120,
    image: 'https://picsum.photos/seed/d2/100', 
    isAvailable: true,
    priceStart: 'من 20 ج.م'
  },
];

export const PROMO_BANNERS: PromoBanner[] = [
  { 
    id: 'b1', 
    title: 'مهرجان الصيف', 
    subtitle: 'خصومات تصل إلى 60% على الإلكترونيات', 
    image: 'https://picsum.photos/seed/b1/800/400', 
    cta: 'تسوق العروض',
    accentColor: '#1877F2'
  },
  { 
    id: 'b2', 
    title: 'كفراوي إكسبريس', 
    subtitle: 'توصيل مجاني لأول 3 طلبات من التطبيق', 
    image: 'https://picsum.photos/seed/b2/800/400', 
    cta: 'اطلب الآن',
    accentColor: '#F27D26'
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    title: 'وظيفة مقترحة لك',
    description: 'مدير تسويق رقمي في شركة كبرى بكفر الدوار',
    image: 'https://picsum.photos/seed/rec1/200/200',
    type: 'job',
    actionLabel: 'شاهد الوظيفة'
  },
  {
    id: 'r2',
    title: 'منتج قد يعجبك',
    description: 'ماكينة حلاقة كهربائية احترافية بخصم 20%',
    image: 'https://picsum.photos/seed/rec2/200/200',
    type: 'product',
    actionLabel: 'شراء الآن'
  }
];
