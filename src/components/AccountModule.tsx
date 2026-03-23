import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ChevronLeft, 
  Settings, 
  Shield, 
  Wallet, 
  Bell, 
  History, 
  LogOut, 
  Camera, 
  Edit2, 
  CheckCircle2, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronRight,
  Info,
  HelpCircle,
  Share2,
  Moon,
  Globe,
  Trash2,
  Zap
} from 'lucide-react';

type AccountSubScreen = 'dashboard' | 'edit-profile' | 'activity' | 'notifications' | 'settings' | 'security' | 'wallet';

interface AccountModuleProps {
  onBack: () => void;
}

export default function AccountModule({ onBack }: AccountModuleProps) {
  const [activeScreen, setActiveScreen] = useState<AccountSubScreen>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  const handleScreenChange = (screen: AccountSubScreen) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveScreen(screen);
      setIsLoading(false);
    }, 400);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <ProfileDashboard onNavigate={handleScreenChange} onBack={onBack} />;
      case 'edit-profile':
        return <EditProfile onBack={() => setActiveScreen('dashboard')} />;
      case 'activity':
        return <ActivityTabs onBack={() => setActiveScreen('dashboard')} />;
      case 'notifications':
        return <NotificationsScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'security':
        return <SecurityScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'wallet':
        return <WalletScreen onBack={() => setActiveScreen('dashboard')} />;
      default:
        return <ProfileDashboard onNavigate={handleScreenChange} onBack={onBack} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans rtl" dir="rtl">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          >
            <div className="w-12 h-12 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderScreen()}
      </motion.div>
    </div>
  );
}

// --- Sub-Components ---

const Header = ({ title, onBack, rightElement }: { title: string, onBack: () => void, rightElement?: React.ReactNode }) => (
  <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pt-12 pb-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
    {rightElement}
  </header>
);

// 1. Profile Dashboard
const ProfileDashboard = ({ onNavigate, onBack }: { onNavigate: (s: AccountSubScreen) => void, onBack: () => void }) => {
  const menuItems = [
    { id: 'wallet', title: 'المحفظة الرقمية', icon: <Wallet className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600', screen: 'wallet' as AccountSubScreen },
    { id: 'activity', title: 'النشاط والطلبات', icon: <History className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', screen: 'activity' as AccountSubScreen },
    { id: 'notifications', title: 'التنبيهات', icon: <Bell className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600', screen: 'notifications' as AccountSubScreen },
    { id: 'security', title: 'الأمان والخصوصية', icon: <Shield className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', screen: 'security' as AccountSubScreen },
    { id: 'settings', title: 'الإعدادات', icon: <Settings className="w-5 h-5" />, color: 'bg-slate-100 text-slate-600', screen: 'settings' as AccountSubScreen },
  ];

  return (
    <div className="pb-24">
      <header className="bg-gradient-to-l from-royal-900 to-royal-700 text-white px-6 pt-16 pb-12 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/user1/200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => onNavigate('edit-profile')}
              className="absolute -bottom-2 -right-2 p-2 bg-gold-500 text-white rounded-xl shadow-lg border-2 border-royal-700 hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-black">أحمد محمد علي</h2>
          <p className="text-royal-100 text-sm font-medium opacity-80">cfo.moaz@gmail.com</p>
          
          <div className="mt-6 flex gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-bold opacity-60 uppercase">النقاط</p>
              <p className="text-lg font-black text-gold-400">1,240</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-bold opacity-60 uppercase">الرحلات</p>
              <p className="text-lg font-black text-white">48</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-bold opacity-60 uppercase">التقييم</p>
              <p className="text-lg font-black text-white">4.9</p>
            </div>
          </div>
        </div>

        <button onClick={onBack} className="absolute top-12 right-6 p-2 bg-white/10 rounded-full text-white">
          <ChevronRight className="w-6 h-6" />
        </button>
      </header>

      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-2 space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.screen)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:translate-x-[-4px] transition-transform" />
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">الدعم والمساعدة</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">مركز المساعدة</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">عن كفراوي</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        <button className="mt-8 w-full flex items-center justify-center gap-3 p-5 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-colors">
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

// 2. Edit Profile
const EditProfile = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: 'أحمد محمد علي',
    email: 'cfo.moaz@gmail.com',
    phone: '+20 123 456 7890',
    address: 'كفر الدوار، شارع الجمهورية'
  });

  const handleSave = () => {
    alert('تم حفظ التغييرات بنجاح');
    onBack();
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="تعديل الملف الشخصي" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-[32px] border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl">
              <img src="https://picsum.photos/seed/user1/200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-royal-600 text-white rounded-2xl shadow-lg border-4 border-white dark:border-slate-900">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-12 pl-4 font-bold focus:ring-2 focus:ring-royal-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">البريد الإلكتروني</label>
            <div className="relative">
              <Bell className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-12 pl-4 font-bold focus:ring-2 focus:ring-royal-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">رقم الهاتف</label>
            <div className="relative">
              <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pr-12 pl-4 font-bold focus:ring-2 focus:ring-royal-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-royal-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-royal-600/20 active:scale-95 transition-all"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};

// 3. Activity Tabs
const ActivityTabs = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'rides' | 'orders'>('rides');

  const rides = [
    { id: '1', date: '23 مارس، 2026', from: 'شارع الجمهورية', to: 'مستشفى كفر الدوار', price: '45.00', status: 'completed' },
    { id: '2', date: '21 مارس، 2026', from: 'النادي الرياضي', to: 'المنزل', price: '35.00', status: 'completed' },
    { id: '3', date: '19 مارس، 2026', from: 'السوق الكبير', to: 'شارع المحطة', price: '55.00', status: 'cancelled' },
  ];

  const orders = [
    { id: '1', date: '22 مارس، 2026', store: 'مطعم المدينة', items: '3 وجبات عائلية', price: '450.00', status: 'delivered' },
    { id: '2', date: '20 مارس، 2026', store: 'سوبر ماركت الخير', items: 'مستلزمات منزلية', price: '890.00', status: 'delivered' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header title="النشاط والطلبات" onBack={onBack} />
      
      <div className="px-6 py-4">
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex">
          <button 
            onClick={() => setActiveTab('rides')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'rides' ? 'bg-white dark:bg-slate-800 text-royal-600 shadow-sm' : 'text-slate-500'}`}
          >
            الرحلات
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-800 text-royal-600 shadow-sm' : 'text-slate-500'}`}
          >
            الطلبات
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">
        {activeTab === 'rides' ? (
          rides.map((ride) => (
            <div key={ride.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{ride.date}</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">رحلة كفراوي جو</h4>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${ride.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {ride.status === 'completed' ? 'مكتملة' : 'ملغاة'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ride.from}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-royal-900" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ride.to}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <p className="text-sm font-black text-royal-600">{ride.price} ج.م</p>
                <button className="text-xs font-bold text-slate-400 hover:text-royal-600">التفاصيل</button>
              </div>
            </div>
          ))
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{order.date}</p>
                  <h4 className="font-bold text-slate-900 dark:text-white">{order.store}</h4>
                </div>
                <span className="text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-emerald-100 text-emerald-600">
                  تم التوصيل
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{order.items}</p>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <p className="text-sm font-black text-royal-600">{order.price} ج.م</p>
                <button className="text-xs font-bold text-slate-400 hover:text-royal-600">التفاصيل</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 4. Notifications
const NotificationsScreen = ({ onBack }: { onBack: () => void }) => {
  const notifications = [
    { id: '1', title: 'خصم 50% على رحلتك القادمة!', body: 'استخدم الكود GO50 واستمتع بخصم فوري على أي رحلة داخل كفر الدوار.', time: 'منذ 10 دقائق', type: 'promo', unread: true },
    { id: '2', title: 'تم شحن محفظتك بنجاح', body: 'تم إضافة 200 جنيه إلى محفظتك الرقمية عبر فوري.', time: 'منذ ساعتين', type: 'wallet', unread: false },
    { id: '3', title: 'تحديث أمني هام', body: 'يرجى مراجعة إعدادات الأمان الخاصة بحسابك لضمان حماية بياناتك.', time: 'منذ يوم', type: 'security', unread: false },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header 
        title="التنبيهات" 
        onBack={onBack} 
        rightElement={<button className="text-xs font-bold text-royal-600 px-2">قراءة الكل</button>}
      />
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-5 rounded-3xl border transition-all ${notif.unread ? 'bg-royal-50/50 border-royal-100 dark:bg-royal-900/10 dark:border-royal-900/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${notif.type === 'promo' ? 'bg-rose-100 text-rose-600' : notif.type === 'wallet' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                {notif.type === 'promo' ? <Zap className="w-6 h-6" /> : notif.type === 'wallet' ? <Wallet className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{notif.title}</h4>
                  {notif.unread && <div className="w-2 h-2 bg-royal-600 rounded-full shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{notif.body}</p>
                <p className="text-[10px] font-bold text-slate-400 pt-1">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Settings
const SettingsScreen = ({ onBack }: { onBack: () => void }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingsGroups = [
    {
      title: 'الإعدادات العامة',
      items: [
        { id: 'lang', title: 'لغة التطبيق', value: 'العربية', icon: <Globe className="w-5 h-5" /> },
        { id: 'dark', title: 'الوضع الليلي', toggle: true, state: isDarkMode, onToggle: () => setIsDarkMode(!isDarkMode), icon: <Moon className="w-5 h-5" /> },
      ]
    },
    {
      title: 'التنبيهات',
      items: [
        { id: 'push', title: 'تنبيهات النظام', toggle: true, state: notificationsEnabled, onToggle: () => setNotificationsEnabled(!notificationsEnabled), icon: <Bell className="w-5 h-5" /> },
        { id: 'promo', title: 'العروض الترويجية', toggle: true, state: true, icon: <Zap className="w-5 h-5" /> },
      ]
    },
    {
      title: 'الحساب',
      items: [
        { id: 'delete', title: 'حذف الحساب', color: 'text-rose-500', icon: <Trash2 className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header title="الإعدادات" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {settingsGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{group.title}</h3>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color || 'text-slate-600 dark:text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <span className={`font-bold ${item.color || 'text-slate-700 dark:text-slate-200'}`}>{item.title}</span>
                  </div>
                  {item.toggle ? (
                    <button 
                      onClick={item.onToggle}
                      className={`w-12 h-6 rounded-full transition-all relative ${item.state ? 'bg-royal-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.state ? 'left-1' : 'left-7'}`} />
                    </button>
                  ) : item.value ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-sm font-bold">{item.value}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Security
const SecurityScreen = ({ onBack }: { onBack: () => void }) => {
  const securityItems = [
    { id: 'pass', title: 'تغيير كلمة المرور', icon: <Lock className="w-5 h-5" />, desc: 'آخر تغيير منذ 3 أشهر' },
    { id: '2fa', title: 'المصادقة الثنائية', icon: <Smartphone className="w-5 h-5" />, desc: 'مفعلة لحماية حسابك' },
    { id: 'devices', title: 'الأجهزة النشطة', icon: <Eye className="w-5 h-5" />, desc: 'جهاز واحد نشط حالياً' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header title="الأمان والخصوصية" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="bg-royal-900 text-white p-6 rounded-[32px] shadow-xl shadow-royal-900/20 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <div>
            <h3 className="text-lg font-black">حسابك محمي بشكل جيد</h3>
            <p className="text-xs text-royal-200 font-medium mt-1">تم تفعيل كافة ميزات الأمان الموصى بها</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">إعدادات الأمان</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2">
            {securityItems.map((item) => (
              <button key={item.id} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-right">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{item.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Wallet
const WalletScreen = ({ onBack }: { onBack: () => void }) => {
  const transactions = [
    { id: '1', title: 'شحن رصيد (فوري)', amount: '+200.00', date: '22 مارس، 2026', type: 'in' },
    { id: '2', title: 'رحلة كفراوي جو', amount: '-45.00', date: '21 مارس، 2026', type: 'out' },
    { id: '3', title: 'طلب مطعم المدينة', amount: '-120.00', date: '20 مارس، 2026', type: 'out' },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header 
        title="المحفظة الرقمية" 
        onBack={onBack} 
        rightElement={<button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><Plus className="w-5 h-5" /></button>}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-royal-900 to-royal-700 text-white p-8 rounded-[40px] shadow-2xl shadow-royal-900/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <CreditCard className="absolute -bottom-10 -right-10 w-48 h-48 rotate-12" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-royal-200 uppercase tracking-widest mb-1">الرصيد المتاح</p>
                <h2 className="text-4xl font-black">1,450.50 <span className="text-sm font-bold opacity-60">ج.م</span></h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-gold-400" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-white text-royal-900 py-3 rounded-2xl font-black text-sm shadow-lg">شحن الرصيد</button>
              <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-2xl font-black text-sm">تحويل</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'فوري', icon: <Smartphone className="w-5 h-5" /> },
            { label: 'بطاقة', icon: <CreditCard className="w-5 h-5" /> },
            { label: 'تحويل', icon: <ArrowUpRight className="w-5 h-5" /> },
            { label: 'سحب', icon: <ArrowDownLeft className="w-5 h-5" /> },
          ].map((act, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-royal-600 shadow-sm">
                {act.icon}
              </button>
              <span className="text-[10px] font-bold text-slate-500">{act.label}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">آخر المعاملات</h3>
            <button className="text-xs font-bold text-royal-600">الكل</button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{tx.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-black text-sm ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
