import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageCircle, 
  User, 
  Search, 
  Bell, 
  Bot,
  Sparkles,
  Flame,
  Store,
  LogIn,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import KafrawyAI from '../components/KafrawyAI';
import { AuthModal } from '../components/AuthModal';
import { supabase, supabaseConnection } from '../lib/supabase';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(supabaseConnection.isOffline);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('supabase-offline', handleOffline);
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    }).catch(() => {
      setIsOffline(true);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      window.removeEventListener('supabase-offline', handleOffline);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'الرئيسية', path: '/' },
    { icon: <Users className="w-6 h-6" />, label: 'المجتمع', path: '/community' },
    { icon: <MessageCircle className="w-6 h-6" />, label: 'الرسائل', path: '/messages' },
    { icon: <Store className="w-6 h-6" />, label: 'المتاجر', path: '/marketplace' },
    { icon: <User className="w-6 h-6" />, label: 'حسابي', path: '/profile' },
  ];

  const Badge = ({ count }: { count: number }) => (
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
    >
      {count > 9 ? '+9' : count}
    </motion.span>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-main)] font-sans" dir="rtl">
      {isOffline && (
        <div className="bg-red-500 text-white p-3 text-center text-sm font-medium flex items-center justify-center gap-2 z-[100] relative">
          <AlertTriangle className="w-5 h-5" />
          <span>
            تعذر الاتصال بقاعدة البيانات (Supabase). قد يكون المشروع متوقفاً مؤقتاً (Paused) أو محذوفاً. يرجى تفعيل المشروع من لوحة تحكم Supabase.
          </span>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--border)] transition-all relative soft-shadow">
            <Bell className="w-5 h-5 text-[var(--muted)]" />
            <Badge count={5} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 10 }}
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 cursor-pointer"
          >
            ك
          </motion.div>
          <h1 className="text-xl font-black text-primary tracking-tight">كفراوي</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name}&background=random`} 
                className="w-8 h-8 rounded-full border border-[var(--border)]"
                alt="Profile"
              />
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-[var(--background)] hover:bg-rose-50 hover:text-rose-500 transition-all soft-shadow"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول</span>
            </button>
          )}
          <button className="p-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--border)] transition-all soft-shadow">
            <Search className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 glass border-t border-[var(--border)] px-4 py-2 pb-6 sm:pb-2">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  isActive ? 'text-primary bg-primary/5' : 'text-[var(--muted)]'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-black">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* AI Assistant Button */}
      <AnimatePresence>
        {!isAiOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAiOpen(true)}
            className="fixed bottom-24 left-6 z-[90] w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl text-white border-4 border-white"
          >
            <Bot className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAiOpen && (
          <KafrawyAI onClose={() => setIsAiOpen(false)} />
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default MainLayout;
