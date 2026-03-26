import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  X, 
  Check,
  Zap,
  User,
  ShieldCheck
} from 'lucide-react';

interface DriverRequestOverlayProps {
  key?: React.Key;
  ride: {
    id: string;
    pickup: string;
    destination: string;
    price?: string;
    distance?: string;
    riderName?: string;
    riderRating?: number;
  };
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function DriverRequestOverlay({ ride, onAccept, onDecline }: DriverRequestOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline(ride.id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setProgress((prev) => (timeLeft - 1) / 10 * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, ride.id, onDecline]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden"
    >
      {/* Map Background */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://picsum.photos/seed/driver-map/1200/1600" 
          alt="Map" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Route Visualization (Simulated) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
      </div>

      {/* Top Header Info */}
      <div className="relative p-6 pt-12 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">طلب مرتفع (2.1x)</span>
          </div>
          <h2 className="text-2xl font-black text-white">طلب رحلة جديد</h2>
        </div>
        
        <button 
          onClick={() => onDecline(ride.id)}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Map Markers (Simulated) */}
      <div className="flex-1 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-2xl z-10 relative flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="absolute inset-0 w-6 h-6 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      </div>

      {/* Bottom Request Card */}
      <motion.div 
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        className="relative bg-white rounded-t-[40px] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Rider Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-50">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{ride.riderName || 'راكب جديد'}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-amber-700">{ride.riderRating || 4.8}</span>
                </div>
                <div className="flex items-center gap-1 bg-royal-50 px-2 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3 h-3 text-royal-600" />
                  <span className="text-[10px] font-black text-royal-600 uppercase">موثق</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">السعر المتوقع</p>
            <p className="text-3xl font-black text-royal-900">{ride.price || '45.00'} <span className="text-sm font-bold">ج.م</span></p>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">موقع الاستلام (يبعد {ride.distance || '1.2 كم'})</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">{ride.pickup}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">الوقت</p>
              <p className="text-sm font-black text-emerald-600">4 دقيقة</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-royal-50 rounded-xl flex items-center justify-center text-royal-600 shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">الوجهة النهائية</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons with Countdown */}
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => onDecline(ride.id)}
            className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95"
          >
            رفض
          </button>
          
          <button 
            onClick={() => onAccept(ride.id)}
            className="flex-[2.5] relative py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-emerald-600/30 overflow-hidden group active:scale-95 transition-all"
          >
            {/* Progress Background */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-0 bg-emerald-500/30 z-0"
              transition={{ duration: 1, ease: "linear" }}
            />
            
            <div className="relative z-10 flex items-center justify-center gap-3">
              <span>قبول الرحلة</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                {timeLeft}
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Sound Effect Simulation (Visual only) */}
      <div className="absolute top-1/2 left-6 right-6 pointer-events-none">
        <div className="flex justify-center gap-1 opacity-20">
          {[1,2,3,4,5,6,7,8].map(i => (
            <motion.div 
              key={i}
              animate={{ height: [10, 30, 10] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 bg-white rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
