import React, { useState, useEffect } from 'react';
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
  Hammer,
  Paintbrush,
  User,
  Award
} from 'lucide-react';
import DynamicDetails from './DynamicDetails';

interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  distance: string;
  isAvailable: boolean;
  isVerified: boolean;
  image: string;
  description: string;
}

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: <Wrench className="w-4 h-4" /> },
  { id: 'plumber', name: 'سباك', icon: <Wrench className="w-4 h-4" /> },
  { id: 'electrician', name: 'كهربائي', icon: <Zap className="w-4 h-4" /> },
  { id: 'carpenter', name: 'نجار', icon: <Hammer className="w-4 h-4" /> },
  { id: 'painter', name: 'نقاش', icon: <Paintbrush className="w-4 h-4" /> },
];

const MOCK_PROVIDERS: Provider[] = [
  { 
    id: '1', 
    name: 'الأسطى محمد حسن', 
    category: 'plumber', 
    rating: 4.9, 
    reviews: 124, 
    priceRange: '50 - 150 ج.م', 
    distance: '0.8 كم', 
    isAvailable: true, 
    isVerified: true, 
    image: 'https://picsum.photos/seed/p1/200/200',
    description: 'خبرة أكثر من 15 عاماً في أعمال السباكة المنزلية والشبكات الرئيسية. دقة في المواعيد وأمانة في العمل.'
  },
  { 
    id: '2', 
    name: 'المهندس هاني كهرباء', 
    category: 'electrician', 
    rating: 4.7, 
    reviews: 89, 
    priceRange: '70 - 200 ج.م', 
    distance: '1.2 كم', 
    isAvailable: true, 
    isVerified: true, 
    image: 'https://picsum.photos/seed/p2/200/200',
    description: 'متخصص في تأسيس وصيانة الكهرباء المنزلية، تركيب النجف والكشافات، وحل أعطال لوحات المفاتيح.'
  },
  { 
    id: '3', 
    name: 'عماد نجار موبيليا', 
    category: 'carpenter', 
    rating: 4.5, 
    reviews: 56, 
    priceRange: '100 - 300 ج.م', 
    distance: '2.5 كم', 
    isAvailable: false, 
    isVerified: true, 
    image: 'https://picsum.photos/seed/p3/200/200',
    description: 'تصنيع وصيانة جميع أنواع الأثاث المنزلي، غرف النوم، المطابخ، والأبواب والشبابيك.'
  },
  { 
    id: '4', 
    name: 'إبراهيم نقاش ديكور', 
    category: 'painter', 
    rating: 4.8, 
    reviews: 210, 
    priceRange: '150 - 500 ج.م', 
    distance: '1.5 كم', 
    isAvailable: true, 
    isVerified: false, 
    image: 'https://picsum.photos/seed/p4/200/200',
    description: 'أحدث صيحات الديكور والدهانات، ورق حائط، جبس بورد، وتشطيبات فاخرة للشقق والفلل.'
  },
];

export default function SanayiyaServices({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProviders = activeCategory === 'all' 
    ? MOCK_PROVIDERS 
    : MOCK_PROVIDERS.filter(p => p.category === activeCategory);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
          />
        ))}
        <span className="text-xs font-bold mr-1 text-slate-600 dark:text-slate-400">{rating}</span>
      </div>
    );
  };

  if (selectedProvider) {
    return (
      <DynamicDetails 
        title={selectedProvider.name}
        subtitle={CATEGORIES.find(c => c.id === selectedProvider.category)?.name}
        image={selectedProvider.image}
        rating={selectedProvider.rating}
        reviews={selectedProvider.reviews}
        price={selectedProvider.priceRange}
        description={selectedProvider.description}
        mainActionLabel="طلب خدمة الآن"
        onMainAction={() => alert('تم إرسال طلبك بنجاح!')}
        onBack={() => setSelectedProvider(null)}
        category="خدمات الصنايعية"
        features={[
          { icon: <MapPin className="w-4 h-4" />, label: 'المسافة', value: selectedProvider.distance },
          { icon: <Clock className="w-4 h-4" />, label: 'التوفر', value: selectedProvider.isAvailable ? 'متاح الآن' : 'غير متاح' },
          { icon: <Award className="w-4 h-4" />, label: 'التوثيق', value: selectedProvider.isVerified ? 'موثق' : 'غير موثق' },
          { icon: <User className="w-4 h-4" />, label: 'الخبرة', value: 'أكثر من 10 سنوات' },
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
          <h1 className="text-xl font-bold text-royal-900 dark:text-royal-100">الصنايعية</h1>
          <div className="mr-auto">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              متاح الآن
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن صنايعي..." 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pr-10 pl-4 text-sm focus:ring-2 focus:ring-royal-500"
            />
          </div>
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            <span>المسافة</span>
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProviders.map((provider, index) => (
              <motion.div 
                key={provider.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedProvider(provider)}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden cursor-pointer"
              >
                {/* Availability Badge */}
                <div className={`absolute top-0 left-0 w-1 h-full ${provider.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                <div className="flex gap-4">
                  <div className="relative">
                    <img 
                      src={provider.image} 
                      alt={provider.name} 
                      className="w-16 h-16 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {provider.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{provider.name}</h3>
                      {provider.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-royal-500 fill-royal-50 dark:fill-royal-900/30" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(provider.rating)}
                      <span className="text-[10px] text-slate-400">({provider.reviews} تقييم)</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {provider.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {provider.priceRange}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-royal-600 hover:bg-royal-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                    طلب خدمة
                  </button>
                  <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {filteredProviders.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500">عذراً، لا يوجد صنايعية في هذا التصنيف حالياً</p>
          </div>
        )}
      </main>

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
