import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Newspaper,
  Bird,
  DollarSign,
  ExternalLink,
  Store,
  Tag,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  STORIES, 
  PROMO_BANNERS, 
  APP_MODULES, 
  TICKER_ITEMS, 
  BEST_OFFERS,
  PRODUCTS
} from '../../mockData';
import { AppModule, Product } from '../../types';

// --- Components ---

const TickerTape = () => {
  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2 overflow-hidden whitespace-nowrap relative">
      <motion.div 
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 items-center"
      >
        {TICKER_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {item.type === 'gold' && <TrendingUp className="w-4 h-4 text-amber-500" />}
            {item.type === 'news' && <Newspaper className="w-4 h-4 text-blue-500" />}
            {item.type === 'poultry' && <Bird className="w-4 h-4 text-rose-500" />}
            {item.type === 'currency' && <DollarSign className="w-4 h-4 text-emerald-500" />}
            <span className="text-xs font-black text-[var(--text-main)]">{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-5 py-6">
      <div className="relative aspect-[21/9] rounded-[32px] overflow-hidden soft-shadow border border-[var(--border)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0"
          >
            <img 
              src={PROMO_BANNERS[current].image} 
              alt={PROMO_BANNERS[current].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex flex-col justify-center px-8 text-white">
              <h3 className="text-xl font-black mb-2">{PROMO_BANNERS[current].title}</h3>
              <p className="text-sm font-bold opacity-90 mb-4 max-w-[200px]">{PROMO_BANNERS[current].subtitle}</p>
              <button className="w-fit px-6 py-2 rounded-xl bg-white text-black font-black text-xs">
                {PROMO_BANNERS[current].cta}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {PROMO_BANNERS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, onClick }: { module: AppModule; onClick: () => void }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3 group cursor-pointer"
  >
    <div className={`w-16 h-16 rounded-[24px] ${module.color} flex items-center justify-center text-white shadow-lg shadow-${module.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
      {module.icon}
    </div>
    <span className="text-xs font-black text-center">{module.title}</span>
  </motion.div>
);

const SubModuleGrid = ({ module, onBack }: { module: AppModule; onBack: () => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black">{module.title}</h2>
        <button 
          onClick={() => navigate(module.path)}
          className="mr-auto text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          فتح القسم
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {module.subModules?.map(sub => (
          <motion.div 
            key={sub.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(sub.path)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-md`}>
              {sub.icon}
            </div>
            <span className="text-[10px] font-black text-center">{sub.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ProductHorizontal = ({ product }: { product: Product }) => (
  <div className="min-w-[200px] bg-[var(--card)] rounded-[24px] border border-[var(--border)] overflow-hidden soft-shadow neumorph">
    <div className="aspect-square relative">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      {product.isHot && (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
          HOT
        </div>
      )}
    </div>
    <div className="p-3">
      <h4 className="text-xs font-black mb-1 truncate">{product.name}</h4>
      <div className="flex justify-between items-center">
        <span className="text-primary font-black text-sm">{product.price} ج.م</span>
        <div className="flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
          <span className="text-[10px] font-black">{product.rating}</span>
        </div>
      </div>
    </div>
  </div>
);

import CommentsSection from '../../components/CommentsSystem';

// --- Main Feed ---

const HomeFeed: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<AppModule | null>(null);

  const currentUser = {
    id: 'user1',
    name: 'محمد أحمد',
    avatar_url: 'https://ui-avatars.com/api/?name=Mohamed+Ahmed&background=0D8ABC&color=fff'
  };

  return (
    <div className="pb-24">
      {/* Ticker */}
      <TickerTape />

      {/* Banners */}
      <BannerCarousel />

      {/* Modules Section */}
      <div className="px-5 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black tracking-tight">الخدمات والأقسام</h2>
          <button className="text-primary text-xs font-black flex items-center gap-1">
            عرض الكل <LayoutGrid className="w-3 h-3" />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {selectedModule ? (
            <SubModuleGrid module={selectedModule} onBack={() => setSelectedModule(null)} />
          ) : (
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {APP_MODULES.map(module => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  onClick={() => {
                    if (module.subModules) {
                      setSelectedModule(module);
                    } else {
                      navigate(module.path);
                    }
                  }} 
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Stores */}
      <div className="px-5 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black tracking-tight">أهم المتاجر</h2>
          <button className="text-[var(--muted)] text-xs font-black">شاهد المزيد</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[120px] flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 p-1">
                <img src={`https://picsum.photos/seed/store${i}/100`} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-xs font-bold">متجر {i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Offers */}
      <div className="px-5 py-4 bg-primary/5 border-y border-primary/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-tight">أفضل العروض</h2>
          </div>
          <button className="text-primary text-xs font-black">تسوق الكل</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {BEST_OFFERS.map(product => (
            <ProductHorizontal key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Ad Banner Placeholder */}
      <div className="px-5 py-8">
        <div className="w-full aspect-[320/50] bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google AdMob Banner</span>
        </div>
      </div>

      {/* Recent Products */}
      <div className="px-5 py-4">
        <h2 className="text-xl font-black tracking-tight mb-6">وصل حديثاً</h2>
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.slice(0, 4).map(product => (
            <div key={product.id} className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow">
              <img src={product.image} alt="" className="w-full aspect-square object-cover" />
              <div className="p-3">
                <h4 className="text-xs font-black truncate">{product.name}</h4>
                <p className="text-primary font-black text-sm mt-1">{product.price} ج.م</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Comments Section (Demo) */}
      <div className="px-5 py-8">
        <CommentsSection postId="demo-post-123" currentUser={currentUser} />
      </div>
    </div>
  );
};

export default HomeFeed;
