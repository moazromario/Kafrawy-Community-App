import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  ChevronLeft, 
  Star, 
  Filter, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { PRODUCTS, MARKETPLACE_CATEGORIES } from '../../mockData';
import { Product, CartItem } from '../../types';

// --- Components ---

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8 }}
    onClick={onClick}
    className="bg-[var(--card)] rounded-[32px] border border-[var(--border)] overflow-hidden soft-shadow cursor-pointer group neumorph"
  >
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      {product.isHot && (
        <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
          الأكثر مبيعاً
        </div>
      )}
      <button className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 transition-colors">
        <Heart className="w-4 h-4" />
      </button>
    </div>
    <div className="p-4">
      <p className="text-[10px] text-[var(--muted)] font-bold mb-1">{product.category}</p>
      <h4 className="font-black text-sm mb-2 truncate">{product.name}</h4>
      <div className="flex items-center gap-1 mb-3">
        <Star className="w-3 h-3 text-amber-400 fill-current" />
        <span className="text-[11px] font-black">{product.rating}</span>
        <span className="text-[10px] text-[var(--muted)] font-bold">({product.reviews})</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-primary font-black text-lg">{product.price} ج.م</span>
          {product.oldPrice && (
            <span className="text-[var(--muted)] text-xs line-through font-bold">{product.oldPrice} ج.م</span>
          )}
        </div>
        <button className="p-2.5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  </motion.div>
);

const CategoryPill = ({ category, isActive, onClick }: { category: any; isActive: boolean; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap font-black text-sm ${
      isActive 
        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
        : 'bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:border-primary/50'
    }`}
  >
    {category.icon}
    {category.name}
  </motion.button>
);

// --- Screens ---

const ProductList = ({ onProductClick }: { onProductClick: (id: string) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pb-24">
      {/* Search & Filter */}
      <div className="px-5 py-4 sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] soft-shadow">
            <Filter className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="py-6">
        <div className="flex overflow-x-auto hide-scrollbar px-5 gap-3">
          <CategoryPill 
            category={{ name: 'الكل', icon: <ShoppingBag className="w-5 h-5" /> }} 
            isActive={selectedCategory === 'الكل'} 
            onClick={() => setSelectedCategory('الكل')} 
          />
          {MARKETPLACE_CATEGORIES.map(cat => (
            <CategoryPill 
              key={cat.id} 
              category={cat} 
              isActive={selectedCategory === cat.name} 
              onClick={() => setSelectedCategory(cat.name)} 
            />
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-5 grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => onProductClick(product.id)} 
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
            <Search className="w-10 h-10 text-[var(--muted)]" />
          </div>
          <h3 className="text-lg font-black">لا توجد نتائج</h3>
          <p className="text-[var(--muted)] font-bold">جرب البحث بكلمات أخرى</p>
        </div>
      )}
    </div>
  );
};

const ProductDetails = ({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-[var(--background)] pb-32"
    >
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-50 px-5 py-4 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[var(--border)] soft-shadow pointer-events-auto"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[var(--border)] soft-shadow">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[var(--border)] soft-shadow">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="aspect-square bg-white relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? 'w-8 bg-primary' : 'w-2 bg-primary/20'}`} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-6 py-8 -mt-8 bg-[var(--background)] rounded-t-[40px] relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-primary font-black text-sm mb-1">{product.category}</p>
            <h1 className="text-2xl font-black tracking-tight">{product.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-primary block">{product.price} ج.م</span>
            {product.oldPrice && (
              <span className="text-sm text-[var(--muted)] line-through font-bold">{product.oldPrice} ج.م</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-black text-amber-700">{product.rating}</span>
          </div>
          <span className="text-sm text-[var(--muted)] font-bold">{product.reviews} تقييم من المشترين</span>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="font-black text-lg">وصف المنتج</h3>
          <p className="text-[var(--muted)] font-bold leading-relaxed">
            {product.description || 'هذا المنتج عالي الجودة متوفر حصرياً على سوق كفراوي. يتميز بتصميم عصري وأداء متميز يلبي جميع احتياجاتك اليومية.'}
          </p>
        </div>

        {/* Seller Info */}
        {product.seller && (
          <div className="p-5 rounded-[32px] bg-[var(--card)] border border-[var(--border)] flex items-center gap-4 mb-8 neumorph">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/10">
              <img src={product.seller.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm">{product.seller.name}</h4>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-500 fill-current" />
                <span className="text-[11px] font-black">{product.seller.rating} تقييم التاجر</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-black hover:bg-primary hover:text-white transition-all">
              زيارة المتجر
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-black text-emerald-800">توصيل سريع</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-black text-blue-800">ضمان كفراوي</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 glass border-t border-[var(--border)] px-6 py-5 flex items-center gap-6">
        <div className="flex items-center gap-4 bg-[var(--background)] p-1.5 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center soft-shadow"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-black text-lg min-w-[20px] text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => {
            onAddToCart(product);
            navigate('/marketplace/cart');
          }}
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-95 transition-transform"
        >
          <ShoppingCart className="w-6 h-6" />
          إضافة للسلة
        </button>
      </div>
    </motion.div>
  );
};

const CartScreen = ({ cart, onUpdateQuantity, onRemove }: { 
  cart: CartItem[]; 
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[var(--background)] pb-32"
    >
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black">سلة التسوق</h1>
      </header>

      {cart.length === 0 ? (
        <div className="py-32 text-center px-10">
          <div className="w-24 h-24 bg-[var(--card)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)] neumorph">
            <ShoppingCart className="w-12 h-12 text-[var(--muted)]" />
          </div>
          <h2 className="text-2xl font-black mb-2">السلة فارغة</h2>
          <p className="text-[var(--muted)] font-bold mb-8">لم تقم بإضافة أي منتجات للسلة بعد. ابدأ التسوق الآن!</p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20"
          >
            تصفح المنتجات
          </button>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {cart.map(item => (
            <motion.div 
              key={item.id}
              layout
              className="bg-[var(--card)] p-4 rounded-[32px] border border-[var(--border)] flex gap-4 soft-shadow neumorph"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-[var(--border)]">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm truncate">{item.name}</h4>
                <p className="text-xs text-[var(--muted)] font-bold mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black">{item.price} ج.م</span>
                  <div className="flex items-center gap-3 bg-[var(--background)] p-1 rounded-xl border border-[var(--border)]">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Summary */}
          <div className="mt-8 p-6 rounded-[32px] bg-[var(--card)] border border-[var(--border)] space-y-4 neumorph">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-[var(--muted)]">المجموع الفرعي</span>
              <span>{subtotal} ج.م</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-[var(--muted)]">رسوم التوصيل</span>
              <span>{shipping} ج.م</span>
            </div>
            <div className="h-px bg-[var(--border)] my-2" />
            <div className="flex justify-between items-center text-lg font-black">
              <span>الإجمالي</span>
              <span className="text-primary">{total} ج.م</span>
            </div>
          </div>

          <button className="w-full py-5 rounded-[24px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 mt-4 active:scale-95 transition-transform">
            إتمام الشراء
          </button>
        </div>
      )}
    </motion.div>
  );
};

// --- Main Module ---

const MarketplaceModule: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, q: number) => {
    if (q === 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Module Header (Only on list view) */}
      <Routes>
        <Route path="/" element={
          <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
                <ArrowRight className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-black text-primary">سوق كفراوي</h1>
            </div>
            <button 
              onClick={() => navigate('/marketplace/cart')}
              className="p-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--border)] relative soft-shadow"
            >
              <ShoppingCart className="w-6 h-6 text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </header>
        } />
      </Routes>

      <Routes>
        <Route path="/" element={<ProductList onProductClick={(id) => navigate(`/marketplace/product/${id}`)} />} />
        <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={
          <CartScreen 
            cart={cart} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemove={(id) => handleUpdateQuantity(id, 0)} 
          />
        } />
      </Routes>
    </div>
  );
};

export default MarketplaceModule;
