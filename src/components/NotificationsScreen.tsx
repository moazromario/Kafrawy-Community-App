import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  MessageCircle, 
  Heart, 
  Wrench, 
  PartyPopper, 
  Megaphone, 
  Trash2, 
  Check, 
  ArrowRight,
  MoreHorizontal,
  CheckCheck,
  BellOff
} from 'lucide-react';

type NotificationType = 'order' | 'comment' | 'like' | 'service' | 'offer' | 'admin';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'تم تأكيد طلبك',
    description: 'طلبك رقم #12345 قيد التحضير الآن وسوف يصلك قريباً.',
    time: 'منذ 5 دقائق',
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    title: 'علق أحمد على منشورك',
    description: '"شكراً جداً على المعلومات القيمة دي، أفدتني كتير!"',
    time: 'منذ 15 دقيقة',
    isRead: false,
  },
  {
    id: '3',
    type: 'service',
    title: 'اكتملت الخدمة',
    description: 'تم الانتهاء من صيانة السباكة بنجاح. يرجى تقييم الفني.',
    time: 'منذ ساعة',
    isRead: true,
  },
  {
    id: '4',
    type: 'offer',
    title: 'عرض جديد في متجر النور',
    description: 'خصم 20% على جميع أنواع العسل الجبلي لفترة محدودة.',
    time: 'منذ 3 ساعات',
    isRead: false,
  },
  {
    id: '5',
    type: 'like',
    title: 'أعجب محمود بمنشورك',
    description: 'محمود و 5 آخرون أعجبوا بمنشورك في قسم المجتمع.',
    time: 'منذ 5 ساعات',
    isRead: true,
  },
  {
    id: '6',
    type: 'admin',
    title: 'تحديث جديد للتطبيق',
    description: 'قم بتحديث التطبيق الآن للحصول على ميزات "كفراوي" الجديدة.',
    time: 'منذ يوم',
    isRead: true,
  },
];

const TYPE_CONFIG = {
  order: { icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-blue-500', label: 'الطلبات' },
  comment: { icon: <MessageCircle className="w-5 h-5" />, color: 'bg-emerald-500', label: 'المجتمع' },
  like: { icon: <Heart className="w-5 h-5" />, color: 'bg-rose-500', label: 'المجتمع' },
  service: { icon: <Wrench className="w-5 h-5" />, color: 'bg-amber-500', label: 'الخدمات' },
  offer: { icon: <PartyPopper className="w-5 h-5" />, color: 'bg-purple-500', label: 'العروض' },
  admin: { icon: <Megaphone className="w-5 h-5" />, color: 'bg-slate-600', label: 'إداري' },
};

const FILTERS = ['الكل', 'الطلبات', 'المجتمع', 'الخدمات', 'العروض'];

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('الكل');

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = activeFilter === 'الكل' 
    ? notifications 
    : notifications.filter(n => TYPE_CONFIG[n.type].label === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ArrowRight className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-royal-900 dark:text-royal-100">الإشعارات</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={markAllAsRead}
              className="p-2 text-royal-600 dark:text-royal-400 hover:bg-royal-50 dark:hover:bg-royal-900/20 rounded-full transition-colors"
              title="تحديد الكل كمقروء"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
            <button 
              onClick={clearAll}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
              title="مسح الكل"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {FILTERS.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === filter 
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard 
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <BellOff className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">لا توجد إشعارات</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">سوف تظهر إشعاراتك هنا فور وصولها</p>
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
}

const NotificationCard: React.FC<{ 
  notification: Notification; 
  onRead: () => void; 
  onDelete: () => void;
}> = ({ 
  notification, 
  onRead, 
  onDelete 
}) => {
  const config = TYPE_CONFIG[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="relative group overflow-hidden rounded-2xl"
    >
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex justify-between items-center px-6 z-0">
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
          <Check className="w-5 h-5" /> مقروء
        </div>
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
          حذف <Trash2 className="w-5 h-5" />
        </div>
      </div>

      {/* Main Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80) onRead();
          if (info.offset.x < -80) onDelete();
        }}
        className={`relative z-10 p-4 flex gap-4 transition-colors cursor-pointer ${
          notification.isRead 
          ? 'bg-white dark:bg-slate-900' 
          : 'bg-blue-50/50 dark:bg-royal-900/10 border-r-4 border-royal-500'
        } border border-slate-100 dark:border-slate-800 shadow-sm`}
      >
        <div className={`w-12 h-12 rounded-full ${config.color} text-white flex items-center justify-center shrink-0 shadow-lg shadow-current/20`}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className={`text-sm font-bold truncate ${notification.isRead ? 'text-slate-900 dark:text-slate-100' : 'text-royal-900 dark:text-royal-100'}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-royal-500 rounded-full shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
            {notification.description}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">{notification.time}</span>
        </div>

        <button className="p-1 text-slate-300 hover:text-slate-500 self-start">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
