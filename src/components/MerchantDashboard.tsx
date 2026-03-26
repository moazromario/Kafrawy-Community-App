import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Wallet, 
  Plus, 
  Gift, 
  BookOpen, 
  User, 
  Eye, 
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  ArrowLeft,
  Store as StoreIcon,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const salesData = [
  { name: 'السبت', sales: 400, orders: 12 },
  { name: 'الأحد', sales: 300, orders: 8 },
  { name: 'الاثنين', sales: 600, orders: 18 },
  { name: 'الثلاثاء', sales: 800, orders: 24 },
  { name: 'الأربعاء', sales: 500, orders: 15 },
  { name: 'الخميس', sales: 900, orders: 28 },
  { name: 'الجمعة', sales: 1100, orders: 35 },
];

const topProducts = [
  { name: 'عسل سدر', sales: 120, color: '#1e3a8a' },
  { name: 'زيت زيتون', sales: 85, color: '#0f172a' },
  { name: 'تمر مجدول', sales: 65, color: '#334155' },
  { name: 'طقم توابل', sales: 45, color: '#64748b' },
];

interface MerchantDashboardProps {
  onBack: () => void;
  onPreview: () => void;
  onAddAction: (type: 'product' | 'offer' | 'project' | 'profile') => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onBack, onPreview, onAddAction }) => {
  const [activeView, setActiveView] = useState<'overview' | 'orders' | 'products'>('overview');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 px-6 py-6 rounded-b-[40px] shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-royal-100 bg-royal-50 flex items-center justify-center">
              <StoreIcon className="w-6 h-6 text-royal-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">لوحة التاجر</h1>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> متجرك نشط
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <button onClick={onBack} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <User className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mt-6 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'orders', label: 'الطلبات', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'products', label: 'المنتجات', icon: <Package className="w-4 h-4" /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 pb-2 text-xs font-black transition-colors relative whitespace-nowrap ${activeView === tab.id ? 'text-royal-600' : 'text-slate-400'}`}
            >
              {tab.icon}
              {tab.label}
              {activeView === tab.id && (
                <motion.div layoutId="activeDashboardTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-royal-600" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon={<Package className="w-5 h-5" />} 
                  value="24" 
                  label="منتج نشط" 
                  trend="+3" 
                  trendType="up"
                  color="royal"
                />
                <StatCard 
                  icon={<Wallet className="w-5 h-5" />} 
                  value="8.2k" 
                  label="الأرباح (ج.م)" 
                  trend="+12%" 
                  trendType="up"
                  color="emerald"
                />
                <StatCard 
                  icon={<Users className="w-5 h-5" />} 
                  value="450" 
                  label="متابع" 
                  trend="+15" 
                  trendType="up"
                  color="indigo"
                />
                <StatCard 
                  icon={<TrendingUp className="w-5 h-5" />} 
                  value="1.2k" 
                  label="زيارة" 
                  trend="-2%" 
                  trendType="down"
                  color="amber"
                />
              </div>

              {/* Sales Chart */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">أداء المبيعات</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">+15% عن الأسبوع الماضي</span>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                        dy={10}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#1e3a8a" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products & Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Products Bar Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6">المنتجات الأكثر مبيعاً</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                          width={70}
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={12}>
                          {topProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">إدارة سريعة</h2>
                    <button 
                      onClick={onPreview}
                      className="text-[10px] font-black text-royal-600 bg-royal-50 dark:bg-royal-900/20 px-3 py-1.5 rounded-xl flex items-center gap-2"
                    >
                      <Eye className="w-3 h-3" /> معاينة المتجر
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ActionCard 
                      onClick={() => onAddAction('product')}
                      icon={<Plus className="w-5 h-5" />}
                      label="إضافة منتج"
                      color="bg-royal-50 text-royal-600"
                    />
                    <ActionCard 
                      onClick={() => onAddAction('offer')}
                      icon={<Gift className="w-5 h-5" />}
                      label="إضافة عرض"
                      color="bg-rose-50 text-rose-600"
                    />
                    <ActionCard 
                      onClick={() => onAddAction('project')}
                      icon={<BookOpen className="w-5 h-5" />}
                      label="إضافة عمل"
                      color="bg-amber-50 text-amber-600"
                    />
                    <ActionCard 
                      onClick={() => onAddAction('profile')}
                      icon={<User className="w-5 h-5" />}
                      label="تعديل الملف"
                      color="bg-indigo-50 text-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Orders Summary */}
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">أحدث الطلبات</h3>
                  <button onClick={() => setActiveView('orders')} className="text-[10px] font-bold text-royal-600">عرض الكل</button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-black">طلب #1234{order}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">أحمد محمد • منذ {order * 2} ساعة</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-royal-600">150 ج.م</div>
                        <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded-lg inline-block">
                          قيد التنفيذ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث عن رقم الطلب أو العميل..." 
                    className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-3 pr-10 pl-4 text-xs font-bold shadow-sm"
                  />
                </div>
                <button className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                  <Filter className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div key={order} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-royal-50 dark:bg-royal-900/20 rounded-2xl flex items-center justify-center text-royal-600">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black">طلب #1234{order}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">24 مارس 2024 • 10:30 ص</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-xl text-[10px] font-black ${order % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {order % 2 === 0 ? 'مكتمل' : 'قيد التنفيذ'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">أ م</div>
                        <span className="text-xs font-bold">أحمد محمد</span>
                      </div>
                      <div className="text-sm font-black text-royal-600">450 ج.م</div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 bg-royal-600 text-white rounded-xl text-[10px] font-black">تفاصيل الطلب</button>
                      <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">منتجاتك (24)</h2>
                <button 
                  onClick={() => onAddAction('product')}
                  className="bg-royal-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> إضافة منتج
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4].map((product) => (
                  <div key={product} className="bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={`https://picsum.photos/seed/prod${product}/200/200`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-black">عسل نحل سدر أصلي</h4>
                        <p className="text-[10px] text-slate-400 font-bold">التصنيف: أغذية • المخزون: 15</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-royal-600">150 ج.م</span>
                        <div className="flex gap-2">
                          <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
};

const StatCard = ({ icon, value, label, trend, trendType, color }: any) => {
  const colorClasses = {
    royal: 'bg-royal-50 text-royal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
  }[color as 'royal' | 'emerald' | 'indigo' | 'amber'];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 space-y-2">
      <div className={`w-10 h-10 ${colorClasses} rounded-xl flex items-center justify-center`}>{icon}</div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
        <div className={`flex items-center text-[10px] font-bold ${trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
};

const ActionCard = ({ onClick, icon, label, color }: any) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-transform"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
      {icon}
    </div>
    <span className="text-xs font-black text-slate-900 dark:text-white">{label}</span>
  </button>
);

export default MerchantDashboard;
