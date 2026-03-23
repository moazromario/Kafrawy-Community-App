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
  Store,
  Check,
  Zap,
  Clock
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

export default function KafrawyMarket({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('الأحدث');
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (id: string) => {
    setAddedToCartId(id);
    setCartCount(prev => prev + 1);
    setTimeout(() => setAddedToCartId(null), 1500);
  };

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
          { icon: <Store className="w-4 h-4" />, label: 'المتجر', value: 'كفراوي ماركت' },
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
          <div className="mr-auto relative">
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
          </div>
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

        {/* Products Grid */}
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
              <button className="bg-gold-500 hover:bg-gold-600 text-royal-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                <Store className="w-4 h-4" /> أضف منتجك الآن
              </button>
            </div>
            <Store className="absolute -bottom-4 -left-4 w-32 h-32 opacity-10 rotate-12" />
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Simplified for Market) */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-3 px-8 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 text-royal-600">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-medium">المتجر</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Tag className="w-6 h-6" />
          <span className="text-[10px] font-medium">العروض</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Plus className="w-6 h-6" />
          <span className="text-[10px] font-medium">بيع</span>
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
